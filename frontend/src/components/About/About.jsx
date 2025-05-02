import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  FileLock,
  HelpCircle,
  Phone,
  Users,
  CalendarClock,
} from "lucide-react";
import { MapPin } from "lucide-react";
import { Mail } from "lucide-react";

export default function About() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Update document title
    document.title = "Giới thiệu | Trọ Đà Nẵng";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-orange-500 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Về Trọ Đà Nẵng</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Nền tảng kết nối người thuê và chủ trọ hàng đầu tại Đà Nẵng
          </p>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Về chúng tôi
              </h3>
              <Separator className="my-4" />
              <ul className="space-y-3">
                <li>
                  <a
                    href="#mission"
                    className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    <span>Sứ mệnh</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#history"
                    className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <CalendarClock className="w-5 h-5 mr-2" />
                    <span>Lịch sử phát triển</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    <span>Câu hỏi thường gặp</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    <span>Liên hệ</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Company Introduction */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Trọ Đà Nẵng - Nền tảng tìm trọ số 1 Đà Nẵng
              </h2>
              <p className="text-gray-600 mb-4">
                Được thành lập vào năm 2020, Trọ Đà Nẵng là nền tảng trực tuyến
                chuyên cung cấp thông tin về các phòng trọ, căn hộ cho thuê tại
                thành phố Đà Nẵng. Chúng tôi kết nối người tìm thuê nhà với các
                chủ trọ một cách nhanh chóng, hiệu quả và minh bạch.
              </p>
              <p className="text-gray-600">
                Với hệ thống thông tin chi tiết, hình ảnh thực tế và công cụ tìm
                kiếm thông minh, Trọ Đà Nẵng giúp người dùng dễ dàng tìm được
                nơi ở phù hợp với nhu cầu và ngân sách của mình.
              </p>
            </section>

            {/* Mission */}
            <section id="mission" className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Sứ mệnh của chúng tôi
              </h3>
              <p className="text-gray-600 mb-4">
                Trọ Đà Nẵng đặt mục tiêu trở thành cầu nối tin cậy giữa người
                thuê nhà và chủ trọ tại Đà Nẵng. Chúng tôi cam kết:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>
                  Cung cấp thông tin chính xác, minh bạch về các phòng trọ.
                </li>
                <li>
                  Đảm bảo trải nghiệm tìm kiếm đơn giản, nhanh chóng cho người
                  dùng.
                </li>
                <li>
                  Hỗ trợ người thuê nhà và chủ trọ trong quá trình giao dịch.
                </li>
                <li>
                  Xây dựng cộng đồng người thuê nhà và chủ trọ văn minh, tin
                  cậy.
                </li>
              </ul>
            </section>

            {/* History */}
            <section id="history" className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Lịch sử phát triển
              </h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500 font-semibold">
                        2020
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      Khởi đầu
                    </h4>
                    <p className="text-gray-600">
                      Trọ Đà Nẵng được thành lập với mục tiêu giải quyết vấn đề
                      tìm trọ cho sinh viên và người lao động tại Đà Nẵng.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500 font-semibold">
                        2022
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      Mở rộng
                    </h4>
                    <p className="text-gray-600">
                      Mở rộng dịch vụ sang các quận huyện trên toàn thành phố Đà
                      Nẵng, tăng số lượng nhà trọ đăng ký trên hệ thống.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-500 font-semibold">
                        2024
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      Phát triển
                    </h4>
                    <p className="text-gray-600">
                      Ra mắt phiên bản mới với nhiều tính năng hiện đại, trở
                      thành nền tảng tìm trọ hàng đầu tại Đà Nẵng.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Làm thế nào để tìm kiếm phòng trọ?
                  </h4>
                  <p className="text-gray-600">
                    Bạn có thể sử dụng công cụ tìm kiếm trên trang chủ hoặc chọn
                    quận huyện cụ thể để xem danh sách phòng trọ phù hợp.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Làm thế nào để đăng tin cho thuê?
                  </h4>
                  <p className="text-gray-600">
                    Chủ trọ cần đăng ký tài khoản và xác thực thông tin, sau đó
                    có thể đăng tin cho thuê trọ trên hệ thống.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Thông tin phòng trọ có chính xác không?
                  </h4>
                  <p className="text-gray-600">
                    Chúng tôi luôn nỗ lực đảm bảo thông tin chính xác. Tuy
                    nhiên, để chắc chắn, bạn nên liên hệ trực tiếp với chủ trọ
                    và kiểm tra phòng trước khi quyết định.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy & Terms Tabs */}
            <section className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Chính sách & Điều khoản
              </h3>
              <Tabs defaultValue="privacy" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="privacy"
                    className="flex items-center justify-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Chính sách bảo mật
                  </TabsTrigger>
                  <TabsTrigger
                    value="terms"
                    className="flex items-center justify-center"
                  >
                    <FileLock className="w-4 h-4 mr-2" />
                    Điều khoản sử dụng
                  </TabsTrigger>
                </TabsList>
                <section id="privacy" className="mb-4">
                  <TabsContent
                    value="privacy"
                    className="mt-4 p-6 border rounded-lg bg-white"
                  >
                    <h4 className="text-xl font-medium text-gray-800 mb-4">
                      Chính sách bảo mật
                    </h4>

                    <div className="space-y-4 text-gray-600">
                      <p>
                        <strong>1. Thông tin chúng tôi thu thập</strong>
                      </p>
                      <p>
                        Khi sử dụng dịch vụ của Trọ Đà Nẵng, chúng tôi có thể
                        thu thập các thông tin sau:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Thông tin cá nhân: Họ tên, số điện thoại, địa chỉ
                          email, địa chỉ liên hệ.
                        </li>
                        <li>
                          Thông tin đăng nhập: Tên đăng nhập, mật khẩu đã được
                          mã hóa.
                        </li>
                        <li>
                          Thông tin sử dụng: Dữ liệu về cách bạn sử dụng trang
                          web và dịch vụ của chúng tôi.
                        </li>
                        <li>
                          Thông tin thiết bị: Loại thiết bị, hệ điều hành, trình
                          duyệt bạn sử dụng.
                        </li>
                      </ul>

                      <p>
                        <strong>2. Mục đích thu thập thông tin</strong>
                      </p>
                      <p>Chúng tôi sử dụng thông tin thu thập để:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>Cung cấp và duy trì dịch vụ của chúng tôi.</li>
                        <li>
                          Thông báo cho bạn về các thay đổi trong dịch vụ của
                          chúng tôi.
                        </li>
                        <li>
                          Cho phép bạn tham gia các tính năng tương tác của dịch
                          vụ khi bạn chọn làm như vậy.
                        </li>
                        <li>
                          Cải thiện trải nghiệm người dùng và phát triển dịch
                          vụ.
                        </li>
                        <li>
                          Phân tích cách thức sử dụng dịch vụ để cải thiện hiệu
                          suất.
                        </li>
                      </ul>

                      <p>
                        <strong>3. Bảo mật thông tin</strong>
                      </p>
                      <p>
                        Chúng tôi cam kết bảo vệ thông tin của bạn bằng cách:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Sử dụng các biện pháp bảo mật tiêu chuẩn công nghiệp
                          để bảo vệ thông tin cá nhân.
                        </li>
                        <li>
                          Giới hạn quyền truy cập vào thông tin cá nhân chỉ cho
                          nhân viên, đại lý, nhà thầu và bên thứ ba có nhu cầu
                          kinh doanh cần biết.
                        </li>
                        <li>
                          Thực hiện đánh giá bảo mật định kỳ để đảm bảo an toàn
                          thông tin.
                        </li>
                      </ul>

                      <p>
                        <strong>4. Chia sẻ thông tin</strong>
                      </p>
                      <p>
                        Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin
                        cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của
                        bạn, ngoại trừ:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Đối tác cung cấp dịch vụ hỗ trợ hoạt động của trang
                          web.
                        </li>
                        <li>
                          Khi chúng tôi tin rằng việc tiết lộ là cần thiết để
                          tuân thủ luật pháp.
                        </li>
                        <li>
                          Để bảo vệ quyền lợi, tài sản hoặc an toàn của chúng
                          tôi, người dùng của chúng tôi hoặc người khác.
                        </li>
                      </ul>

                      <p>
                        <strong>5. Quyền của bạn</strong>
                      </p>
                      <p>Bạn có quyền:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Truy cập và nhận bản sao thông tin cá nhân của bạn.
                        </li>
                        <li>
                          Yêu cầu sửa đổi thông tin cá nhân không chính xác.
                        </li>
                        <li>Yêu cầu xóa thông tin cá nhân của bạn.</li>
                        <li>
                          Hạn chế hoặc phản đối việc xử lý thông tin cá nhân của
                          bạn.
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                </section>
                <section id="terms" className="mb-4">
                  <TabsContent
                    value="terms"
                    className="mt-4 p-6 border rounded-lg bg-white"
                  >
                    <h4 className="text-xl font-medium text-gray-800 mb-4">
                      Điều khoản sử dụng
                    </h4>

                    <div className="space-y-4 text-gray-600">
                      <p>
                        <strong>1. Chấp nhận điều khoản</strong>
                      </p>
                      <p>
                        Bằng việc truy cập và sử dụng trang web Trọ Đà Nẵng, bạn
                        đồng ý tuân thủ và chịu sự ràng buộc bởi các điều khoản
                        và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ
                        phần nào của các điều khoản này, bạn không nên sử dụng
                        dịch vụ của chúng tôi.
                      </p>

                      <p>
                        <strong>2. Sử dụng dịch vụ</strong>
                      </p>
                      <p>
                        Bạn đồng ý sử dụng dịch vụ chỉ cho các mục đích hợp pháp
                        và theo cách không vi phạm quyền của bất kỳ bên thứ ba
                        nào. Bạn không được:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào.
                        </li>
                        <li>Đăng thông tin sai lệch hoặc lừa đảo.</li>
                        <li>Thu thập thông tin cá nhân của người dùng khác.</li>
                        <li>
                          Can thiệp vào hoạt động bình thường của dịch vụ.
                        </li>
                      </ul>

                      <p>
                        <strong>3. Tài khoản người dùng</strong>
                      </p>
                      <p>
                        Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác
                        và đầy đủ. Bạn hoàn toàn chịu trách nhiệm về việc duy
                        trì tính bảo mật của tài khoản và mật khẩu của mình và
                        cho tất cả các hoạt động diễn ra dưới tài khoản của bạn.
                      </p>

                      <p>
                        <strong>4. Nội dung người dùng</strong>
                      </p>
                      <p>
                        Bạn giữ quyền sở hữu đối với nội dung bạn đăng. Tuy
                        nhiên, bằng việc đăng nội dung, bạn cấp cho chúng tôi
                        quyền sử dụng, sửa đổi, hiển thị và phân phối nội dung
                        đó trên dịch vụ của chúng tôi.
                      </p>
                      <p>
                        Chúng tôi có quyền nhưng không có nghĩa vụ giám sát và
                        xóa nội dung vi phạm các điều khoản này hoặc được cho là
                        không phù hợp.
                      </p>

                      <p>
                        <strong>5. Thông tin đăng tải</strong>
                      </p>
                      <p>Đối với thông tin về phòng trọ, bạn cam kết:</p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Cung cấp thông tin chính xác và trung thực về phòng
                          trọ.
                        </li>
                        <li>
                          Không đăng những hình ảnh không liên quan hoặc sai
                          lệch về phòng trọ.
                        </li>
                        <li>
                          Cập nhật thông tin khi phòng trọ đã được cho thuê.
                        </li>
                        <li>
                          Chịu trách nhiệm về độ chính xác của thông tin đăng
                          tải.
                        </li>
                      </ul>

                      <p>
                        <strong>6. Trách nhiệm và bảo đảm</strong>
                      </p>
                      <p>
                        Dịch vụ được cung cấp "nguyên trạng" và "như có sẵn" mà
                        không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý. Chúng
                        tôi không đảm bảo rằng dịch vụ sẽ không bị gián đoạn,
                        kịp thời, an toàn hoặc không có lỗi.
                      </p>

                      <p>
                        <strong>7. Giới hạn trách nhiệm</strong>
                      </p>
                      <p>
                        Trong mọi trường hợp, Trọ Đà Nẵng sẽ không chịu trách
                        nhiệm về bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc
                        biệt, hậu quả hoặc trừng phạt nào phát sinh từ việc sử
                        dụng hoặc không thể sử dụng dịch vụ.
                      </p>

                      <p>
                        <strong>8. Thay đổi điều khoản</strong>
                      </p>
                      <p>
                        Chúng tôi có thể sửa đổi các điều khoản này bất kỳ lúc
                        nào. Việc tiếp tục sử dụng dịch vụ sau khi đăng các thay
                        đổi sẽ cấu thành sự chấp nhận của bạn đối với các điều
                        khoản sửa đổi.
                      </p>
                    </div>
                  </TabsContent>
                </section>
              </Tabs>
            </section>

            {/* Contact Section */}
            <section id="contact" className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Liên hệ với chúng tôi
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600 mb-4">
                  Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, đừng ngần ngại liên
                  hệ với chúng tôi qua các kênh sau:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-gray-600">
                      Q. Ngũ Hành Sơn, TP. Đà Nẵng
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-gray-600">0236 123 4567</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-gray-600">lienhe@trodanang.vn</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
