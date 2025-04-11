import {Button} from '../button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../shadcn/dialog';

export function LogoUploadGuide() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="link" className="text-xs">
          Read the logo guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[100vh] md:max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Logo Upload Guide</DialogTitle>
          <DialogDescription>
            Follow these tips for the best results with your customized products
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 overflow-y-auto pr-1">
          <div>
            <h3 className="text-sm font-medium mb-1">Format Recommendations</h3>
            <p className="text-sm text-gray-600">
              For best results, use a landscape-oriented logo. Our label designs
              are optimized for horizontal logos, which provide better
              visibility and aesthetic balance on our products.
            </p>
            <div className="flex space-x-4 mt-2">
              <div className="border rounded p-2 flex-1">
                <p className="text-xs text-center mb-1 text-green-600 font-medium">
                  Recommended
                </p>
                <div className="bg-gray-100 h-12 rounded flex items-center justify-center border">
                  <div className="bg-gray-300 w-24 h-8 rounded"></div>
                </div>
                <p className="text-xs text-center mt-1">Landscape format</p>
              </div>
              <div className="border rounded p-2 flex-1">
                <p className="text-xs text-center mb-1 text-amber-600 font-medium">
                  Not ideal
                </p>
                <div className="bg-gray-100 h-12 rounded flex items-center justify-center border">
                  <div className="bg-gray-300 w-8 h-8 rounded"></div>
                </div>
                <p className="text-xs text-center mt-1">Square format</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">File Type Priority</h3>
            <p className="text-sm text-gray-600">
              Choose the right file format for optimal printing quality:
            </p>
            <ol className="mt-2 space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium">SVG (Preferred)</p>
                  <p className="text-xs text-gray-600">
                    Vector format that scales perfectly at any size without
                    losing quality.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium">PDF</p>
                  <p className="text-xs text-gray-600">
                    Vector-based PDFs maintain quality at any scale and print
                    with crisp edges.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium">PNG</p>
                  <p className="text-xs text-gray-600">
                    Only use if vector formats are unavailable. Choose high
                    resolution (300+ DPI).
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Multiple Products</h3>
            <p className="text-sm text-gray-600">
              Your uploaded logos are saved for your entire order. When ordering
              multiple customizable products, you only need to upload the logos
              to one of the products.
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-bold">NOTE:</span> In case we have
              questions, we will reach out to you via email. Please ensure you
              provide a valid email address during checkout.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Design Tips</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>
                Use simple designs with clear lines for best printing results
              </li>
              <li>
                Avoid very fine details that might not reproduce well at small
                sizes
              </li>
              <li>Ensure sufficient contrast between elements of your logo</li>
              <li>
                Consider how your logo will look in black and white if
                applicable
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
