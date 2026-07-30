import AVFoundation
import AppKit
import CoreVideo

let framesDirectory = URL(fileURLWithPath: "/private/tmp/ork-genesis-frames")
let outputURL = URL(fileURLWithPath: "/private/tmp/ork-genesis.mov")
try? FileManager.default.removeItem(at: outputURL)

let width = 1920
let height = 1080
let fps: Int32 = 30
let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mov)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 12_000_000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
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

for frame in 0..<300 {
    while !input.isReadyForMoreMediaData { usleep(1000) }
    let path = framesDirectory.appendingPathComponent(String(format: "frame-%04d.png", frame))
    guard let image = NSImage(contentsOf: path),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        fatalError("Missing frame \(frame)")
    }
    var pixelBuffer: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pixelBuffer)
    guard let buffer = pixelBuffer else { fatalError("Cannot create pixel buffer") }
    CVPixelBufferLockBaseAddress(buffer, [])
    let context = CGContext(
        data: CVPixelBufferGetBaseAddress(buffer),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue
    )!
    context.translateBy(x: 0, y: CGFloat(height))
    context.scaleBy(x: 1, y: -1)
    context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
    CVPixelBufferUnlockBaseAddress(buffer, [])
    adaptor.append(buffer, withPresentationTime: CMTime(value: Int64(frame), timescale: fps))
}
input.markAsFinished()
await writer.finishWriting()
if writer.status != .completed { fatalError(writer.error?.localizedDescription ?? "Encoding failed") }
print(outputURL.path)
