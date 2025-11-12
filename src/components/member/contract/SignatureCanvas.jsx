import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

/**
 * SignatureCanvas Component
 * Component để vẽ chữ ký trên canvas
 */
const SignatureCanvas = forwardRef(({ onSignatureChange, className = '' }, ref) => {
  const log = (...args) => {
    // eslint-disable-next-line no-console
    console.log('[SignatureCanvas]', ...args)
  }
  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef({ x: 0, y: 0 })
  const signatureCallbackRef = useRef(onSignatureChange)

  useEffect(() => {
    signatureCallbackRef.current = onSignatureChange
  }, [onSignatureChange])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size based on container
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      
      // Only set size if rect is valid
      if (rect.width > 0 && rect.height > 0) {
        // Set canvas size to match container
        canvas.width = rect.width
        canvas.height = rect.height

        log('setCanvasSize', {
          width: rect.width,
          height: rect.height
        })

        // Get context and set drawing properties
        const ctx = canvas.getContext('2d')
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    }

    // Initialize canvas size - use requestAnimationFrame to ensure DOM is ready
    const initCanvas = () => {
      requestAnimationFrame(() => {
        setCanvasSize()
      })
    }
    
    initCanvas()
    log('initCanvas')

    // Get context for drawing
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const getPointFromEvent = (e) => {
      const rect = canvas.getBoundingClientRect()
      
      let x, y
      if (e.touches && e.touches.length > 0) {
        // Touch event
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
      } else {
        // Mouse event
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      }
      
      return { x, y }
    }

    const startDrawing = (e) => {
      e.preventDefault()
      const point = getPointFromEvent(e)
      isDrawingRef.current = true
      lastPointRef.current = point
      log('startDrawing', point)
    }

    const draw = (e) => {
      e.preventDefault()
      if (!isDrawingRef.current) return

      log('draw event')

      // Get fresh context in case canvas was resized
      const currentCtx = canvas.getContext('2d')
      currentCtx.strokeStyle = '#000000'
      currentCtx.lineWidth = 2
      currentCtx.lineCap = 'round'
      currentCtx.lineJoin = 'round'

      const point = getPointFromEvent(e)
      currentCtx.beginPath()
      currentCtx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
      currentCtx.lineTo(point.x, point.y)
      currentCtx.stroke()

      lastPointRef.current = point
      log('draw line to', point)

      // Notify parent of signature change
      if (signatureCallbackRef.current) {
        signatureCallbackRef.current(canvas.toDataURL('image/png'))
        log('signature updated')
      }
    }

    const stopDrawing = (e) => {
      e.preventDefault()
      if (isDrawingRef.current) {
        isDrawingRef.current = false
        log('stopDrawing')
      }
    }

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('mouseleave', stopDrawing)

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false })
    canvas.addEventListener('touchmove', draw, { passive: false })
    canvas.addEventListener('touchend', stopDrawing, { passive: false })
    canvas.addEventListener('touchcancel', stopDrawing, { passive: false })

    // Handle window resize
    const handleResize = () => {
      setCanvasSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
      canvas.removeEventListener('mouseleave', stopDrawing)
      canvas.removeEventListener('touchstart', startDrawing)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', stopDrawing)
      canvas.removeEventListener('touchcancel', stopDrawing)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const clear = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (signatureCallbackRef.current) {
        signatureCallbackRef.current('')
      }
      log('clear signature')
    }
  }

  const getDataURL = () => {
    const canvas = canvasRef.current
    return canvas ? canvas.toDataURL('image/png') : ''
  }

  const isEmpty = () => {
    const canvas = canvasRef.current
    if (!canvas) return true
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    // Check if canvas has any non-transparent pixels
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] !== 0) {
        return false
      }
    }
    return true
  }

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    clear,
    getDataURL,
    isEmpty
  }), [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-48 border rounded bg-white cursor-crosshair ${className}`}
      style={{ touchAction: 'none', display: 'block' }}
      width={400}
      height={192}
    />
  )
})

SignatureCanvas.displayName = 'SignatureCanvas'

export default SignatureCanvas
