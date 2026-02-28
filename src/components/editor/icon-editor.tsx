// src/components/editor/icon-editor.tsx
// 图标编辑器组件

'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Download, Type, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'

interface IconEditorProps {
  imageUrl: string
  appName: string
  onExport: (dataUrl: string) => void
  onCancel: () => void
}

export function IconEditor({ imageUrl, appName, onExport, onCancel }: IconEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null)
  const [loading, setLoading] = useState(true)
  
  // 文字设置
  const [enableText, setEnableText] = useState(true)
  const [text, setText] = useState(appName)
  const [fontSize, setFontSize] = useState(80)
  const [fontColor, setFontColor] = useState('#ffffff')
  const [textPosition, setTextPosition] = useState<'bottom' | 'top' | 'center'>('bottom')
  
  // 文字遮罩（用于覆盖 AI 生成的原文字）
  const [enableMask, setEnableMask] = useState(false)
  const [maskPosition, setMaskPosition] = useState(850)
  const [maskHeight, setMaskHeight] = useState(150)
  const [maskColor, setMaskColor] = useState('#000000')
  
  // 效果设置
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  
  // 初始化 Canvas
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1024,
      height: 1024,
    })
    
    // 加载 AI 生成的图片
    fabric.Image.fromURL(imageUrl, (img, error) => {
      if (error) {
        console.error('Failed to load image:', error)
        toast.error('图片加载失败')
        return
      }
      
      const scale = Math.min(1024 / img.width!, 1024 / img.height!)
      img.set({
        left: 512,
        top: 512,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false,
      })
      canvas.add(img)
      canvas.sendToBack(img)
      setLoading(false)
    })
    
    // 添加文字遮罩（可选）
    const maskRect = new fabric.Rect({
      left: 512,
      top: maskPosition,
      width: 1024,
      height: maskHeight,
      fill: maskColor,
      originX: 'center',
      selectable: false,
      visible: enableMask,
    })
    canvas.add(maskRect)
    
    // 添加可编辑文字
    const textObj = new fabric.IText(text, {
      left: 512,
      top: textPosition === 'bottom' ? maskPosition + maskHeight / 2 : 
           textPosition === 'top' ? 150 : 512,
      originX: 'center',
      originY: 'center',
      fontSize: fontSize,
      fill: fontColor,
      fontFamily: 'Inter',
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.5)',
        blur: 10,
      }),
      visible: enableText,
    })
    canvas.add(textObj)
    
    setFabricCanvas(canvas)
    
    return () => {
      canvas.dispose()
    }
  }, [])
  
  // 更新文字
  const updateText = () => {
    if (!fabricCanvas) return
    const textObj = fabricCanvas.getObjects().find(obj => obj.type === 'i-text')
    if (textObj && textObj.type === 'i-text') {
      const yPos = textPosition === 'bottom' ? maskPosition + maskHeight / 2 : 
                   textPosition === 'top' ? 150 : 512
      textObj.set({
        text,
        fontSize,
        fill: fontColor,
        top: yPos,
      })
      fabricCanvas.renderAll()
    }
  }
  
  // 更新遮罩
  const updateMask = () => {
    if (!fabricCanvas) return
    const maskObj = fabricCanvas.getObjects().find(obj => obj.type === 'rect')
    if (maskObj && maskObj.type === 'rect') {
      maskObj.set({
        top: maskPosition,
        height: maskHeight,
        fill: maskColor,
        visible: enableMask,
      })
      fabricCanvas.renderAll()
      updateText() // 文字位置依赖遮罩
    }
  }
  
  // 切换文字显示
  const toggleText = (checked: boolean) => {
    setEnableText(checked)
    if (fabricCanvas) {
      const textObj = fabricCanvas.getObjects().find(obj => obj.type === 'i-text')
      if (textObj) {
        textObj.set({ visible: checked })
        fabricCanvas.renderAll()
      }
    }
  }
  
  // 切换遮罩
  const toggleMask = (checked: boolean) => {
    setEnableMask(checked)
    updateMask()
  }
  
  // 应用滤镜
  const applyFilters = () => {
    if (!fabricCanvas) return
    const imgObj = fabricCanvas.getObjects().find(obj => obj.type === 'image')
    if (imgObj && imgObj.type === 'image') {
      const img = imgObj as fabric.Image
      img.filters = []
      
      if (brightness !== 100) {
        img.filters.push(new fabric.Image.filters.Brightness({
          brightness: (brightness - 100) / 100
        }))
      }
      
      if (contrast !== 100) {
        img.filters.push(new fabric.Image.filters.Contrast({
          contrast: (contrast - 100) / 100
        }))
      }
      
      img.applyFilters()
      fabricCanvas.renderAll()
    }
  }
  
  // 导出
  const handleExport = () => {
    if (!fabricCanvas) return
    
    toast.loading('正在导出...')
    
    // 取消选中状态
    fabricCanvas.discardActiveObject()
    fabricCanvas.renderAll()
    
    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
    })
    
    toast.dismiss()
    toast.success('导出成功！')
    onExport(dataUrl)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">正在加载编辑器...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 画布区域 */}
      <div className="lg:col-span-2">
        <div className="bg-background rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">图标编辑器</h3>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              关闭
            </Button>
          </div>
          <canvas 
            ref={canvasRef} 
            className="w-full border rounded bg-muted"
            style={{ maxHeight: '70vh' }}
          />
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button onClick={onCancel} variant="outline">取消</Button>
          <Button onClick={handleExport} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            导出图片
          </Button>
        </div>
      </div>
      
      {/* 工具栏 */}
      <div className="space-y-4">
        <Tabs defaultValue="text">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="text">
              <Type className="h-4 w-4 mr-2" />
              文字
            </TabsTrigger>
            <TabsTrigger value="effect">
              <Sparkles className="h-4 w-4 mr-2" />
              效果
            </TabsTrigger>
          </TabsList>
          
          {/* 文字编辑 */}
          <TabsContent value="text" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">启用文字</label>
              <Switch checked={enableText} onCheckedChange={toggleText} />
            </div>
            
            {enableText && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">文字内容</label>
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={updateText}
                    placeholder="输入文字"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    字号：{fontSize}px
                  </label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(v) => {
                      setFontSize(v[0])
                      setTimeout(updateText, 100)
                    }}
                    min={20}
                    max={200}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">文字位置</label>
                  <div className="flex gap-2">
                    <Button
                      variant={textPosition === 'top' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setTextPosition('top')
                        setTimeout(updateText, 100)
                      }}
                    >
                      顶部
                    </Button>
                    <Button
                      variant={textPosition === 'center' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setTextPosition('center')
                        setTimeout(updateText, 100)
                      }}
                    >
                      中间
                    </Button>
                    <Button
                      variant={textPosition === 'bottom' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setTextPosition('bottom')
                        setTimeout(updateText, 100)
                      }}
                    >
                      底部
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">文字颜色</label>
                  <Input
                    type="color"
                    value={fontColor}
                    onChange={(e) => {
                      setFontColor(e.target.value)
                      setTimeout(updateText, 100)
                    }}
                    className="w-full h-10"
                  />
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">文字遮罩</label>
                    <Switch checked={enableMask} onCheckedChange={toggleMask} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    如果 AI 生成的图片已有文字，启用遮罩覆盖
                  </p>
                  
                  {enableMask && (
                    <>
                      <div>
                        <label className="text-xs mb-1 block">
                          遮罩位置：{maskPosition}px
                        </label>
                        <Slider
                          value={[maskPosition]}
                          onValueChange={(v) => {
                            setMaskPosition(v[0])
                            setTimeout(updateMask, 100)
                          }}
                          min={400}
                          max={900}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs mb-1 block">
                          遮罩高度：{maskHeight}px
                        </label>
                        <Slider
                          value={[maskHeight]}
                          onValueChange={(v) => {
                            setMaskHeight(v[0])
                            setTimeout(updateMask, 100)
                          }}
                          min={50}
                          max={300}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs mb-1 block">遮罩颜色</label>
                        <Input
                          type="color"
                          value={maskColor}
                          onChange={(e) => {
                            setMaskColor(e.target.value)
                            setTimeout(updateMask, 100)
                          }}
                          className="w-full h-8"
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </TabsContent>
          
          {/* 效果调整 */}
          <TabsContent value="effect" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                亮度：{brightness}%
              </label>
              <Slider
                value={[brightness]}
                onValueChange={(v) => {
                  setBrightness(v[0])
                  setTimeout(applyFilters, 100)
                }}
                min={0}
                max={200}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                对比度：{contrast}%
              </label>
              <Slider
                value={[contrast]}
                onValueChange={(v) => {
                  setContrast(v[0])
                  setTimeout(applyFilters, 100)
                }}
                min={0}
                max={200}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
