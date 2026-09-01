import AVFoundation
import AppKit
import CoreVideo

let project = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let imageURL = project.appendingPathComponent("public/assets/development-orca-hero-v3.png")
let outputURL = project.appendingPathComponent("public/assets/development-orca-hero-loop.mp4")
try? FileManager.default.removeItem(at: outputURL)

guard let image = NSImage(contentsOf: imageURL),
      let source = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  fatalError("Could not load source image")
}

let width = 1920
let height = 1080
let fps: Int32 = 30
let frameCount = 240
let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let settings: [String: Any] = [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 8_000_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoMaxKeyFrameIntervalKey: 60
  ]
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let attributes: [String: Any] = [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  kCVPixelBufferWidthKey as String: width,
  kCVPixelBufferHeightKey as String: height
]
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: attributes)
guard writer.canAdd(input) else { fatalError("Cannot add video input") }
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

let rgb = CGColorSpaceCreateDeviceRGB()
let magenta = CGColor(red: 0.89, green: 0.08, blue: 0.45, alpha: 1)
let violet = CGColor(red: 0.34, green: 0.12, blue: 0.62, alpha: 1)

for frame in 0..<frameCount {
  while !input.isReadyForMoreMediaData { usleep(1000) }
  var pixelBuffer: CVPixelBuffer?
  CVPixelBufferCreate(nil, width, height, kCVPixelFormatType_32BGRA, attributes as CFDictionary, &pixelBuffer)
  guard let buffer = pixelBuffer else { fatalError("Cannot create pixel buffer") }
  CVPixelBufferLockBaseAddress(buffer, [])
  guard let context = CGContext(
    data: CVPixelBufferGetBaseAddress(buffer), width: width, height: height,
    bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
    space: rgb, bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
  ) else { fatalError("Cannot create drawing context") }

  let phase = Double(frame) / Double(frameCount) * Double.pi * 2
  let breathe = (sin(phase) + 1) * 0.5
  let zoom = 1.025 + 0.025 * breathe
  let drawWidth = CGFloat(width) * zoom
  let drawHeight = CGFloat(height) * zoom
  let driftX = CGFloat(sin(phase)) * 15 - (drawWidth - CGFloat(width)) / 2
  let driftY = CGFloat(cos(phase)) * 8 - (drawHeight - CGFloat(height)) / 2

  context.setFillColor(CGColor(gray: 0.015, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.interpolationQuality = .high
  context.draw(source, in: CGRect(x: driftX, y: driftY, width: drawWidth, height: drawHeight))

  let pulseAlpha = CGFloat(0.055 + breathe * 0.065)
  if let glow = CGGradient(colorsSpace: rgb, colors: [magenta.copy(alpha: pulseAlpha)!, violet.copy(alpha: 0)!] as CFArray, locations: [0, 1]) {
    context.drawRadialGradient(glow, startCenter: CGPoint(x: 1420, y: 470), startRadius: 0, endCenter: CGPoint(x: 1420, y: 470), endRadius: 520, options: [])
  }

  context.setStrokeColor(CGColor(red: 0.95, green: 0.12, blue: 0.58, alpha: CGFloat(0.04 + breathe * 0.035)))
  context.setLineWidth(1)
  for index in 0..<5 {
    let offset = CGFloat(index) * 116 + CGFloat(sin(phase + Double(index))) * 12
    context.move(to: CGPoint(x: 760, y: 90 + offset))
    context.addCurve(to: CGPoint(x: 1910, y: 210 + offset), control1: CGPoint(x: 1080, y: 210 + offset), control2: CGPoint(x: 1540, y: 20 + offset))
    context.strokePath()
  }

  CVPixelBufferUnlockBaseAddress(buffer, [])
  adaptor.append(buffer, withPresentationTime: CMTime(value: Int64(frame), timescale: fps))
}

input.markAsFinished()
writer.finishWriting {
  if writer.status == .completed { print(outputURL.path) }
  else { fputs((writer.error?.localizedDescription ?? "Encoding failed") + "\n", stderr) }
  exit(writer.status == .completed ? 0 : 1)
}
RunLoop.current.run()
