import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-white py-6 mt-12 border-t">
      <div className="container mx-auto px-4 text-center">
        <h4 className="text-xl font-semibold text-orange-500 mb-2">Trọ Đà Nẵng</h4>
        <p className="text-gray-600 text-sm mb-4">
          Nền tảng tìm kiếm nhà trọ hàng đầu tại Đà Nẵng
        </p>
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Trọ Đà Nẵng. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
