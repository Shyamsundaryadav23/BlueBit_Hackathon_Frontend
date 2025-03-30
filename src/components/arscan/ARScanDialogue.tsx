import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ARScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARScanDialog: React.FC<ARScanDialogProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((mediaStream) => {
          activeStream = mediaStream;
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        {/* Fullscreen video container */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2 text-white border-white hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
            <span>Close</span>
          </Button>
        </div>
        {/* Hidden accessible title/description */}
        <VisuallyHidden asChild>
          <DialogTitle>AR Scan</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>View live video from your camera</DialogDescription>
        </VisuallyHidden>
      </DialogContent>
    </Dialog>
  );
};

export default ARScanDialog;
