import React from "react";
import { Collapse, Card } from "antd";
import {
  QuestionCircleOutlined,
  SafetyOutlined,
  CreditCardOutlined,
  CarOutlined,
  SyncOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import styles from "./FAQSection.module.css";

const { Panel } = Collapse;

const FAQSection = () => {
  const faqs = [
    {
      key: "1",
      icon: <SafetyOutlined />,
      question: "Pin xe điện đã qua sử dụng có an toàn không?",
      answer:
        "Có, tất cả pin xe điện đã qua sử dụng của chúng tôi đều trải qua quy trình kiểm tra và chứng nhận nghiêm ngặt. Mỗi viên pin được kiểm tra kỹ lưỡng về dung lượng, độ ổn định điện áp và tình trạng tổng thể. Chúng tôi chỉ bán những viên pin đáp ứng tiêu chuẩn an toàn nghiêm ngặt của chúng tôi, và tất cả đều đi kèm với báo cáo sức khỏe chi tiết và bảo hành để bạn an tâm.",
    },
    {
      key: "2",
      icon: <QuestionCircleOutlined />,
      question: "Bảo hành pin bao gồm những gì?",
      answer:
        "Bảo hành của chúng tôi thường bao gồm lỗi sản xuất, suy giảm dung lượng vượt quá giới hạn quy định và hỏng hóc điện. Thời gian bảo hành từ 1-3 năm tùy thuộc vào tình trạng pin và thương hiệu. Bảo hành bao gồm sửa chữa miễn phí hoặc thay thế nếu pin không đáp ứng thông số kỹ thuật trong thời gian bảo hành.",
    },
    {
      key: "3",
      icon: <CarOutlined />,
      question: "Làm sao biết pin có tương thích với xe điện của tôi không?",
      answer:
        "Mỗi sản phẩm đều có thông tin tương thích chi tiết. Bạn có thể lọc theo hãng xe và model, hoặc kiểm tra thông số kỹ thuật của pin (điện áp, dung lượng, loại đầu nối). Đội ngũ hỗ trợ khách hàng của chúng tôi cũng sẵn sàng giúp xác minh tính tương thích trước khi mua. Chúng tôi khuyến nghị tham khảo sách hướng dẫn xe hoặc chuyên gia của chúng tôi để xác nhận.",
    },
    {
      key: "4",
      icon: <CreditCardOutlined />,
      question: "Bạn chấp nhận những phương thức thanh toán nào?",
      answer:
        "Chúng tôi chấp nhận nhiều phương thức thanh toán bao gồm thẻ tín dụng/ghi nợ (Visa, Mastercard, American Express), PayPal, chuyển khoản ngân hàng và các tùy chọn tài chính cho người mua đủ điều kiện. Tất cả giao dịch đều được bảo mật bằng mã hóa SSL. Đối với đơn hàng lớn, chúng tôi cũng cung cấp điều khoản thanh toán net cho doanh nghiệp.",
    },
    {
      key: "5",
      icon: <SyncOutlined />,
      question: "Chính sách đổi trả và hoàn tiền của bạn là gì?",
      answer:
        "Chúng tôi cung cấp chính sách đổi trả trong 30 ngày kể từ ngày giao hàng. Nếu pin không đáp ứng mong đợi của bạn hoặc có vấn đề, bạn có thể trả lại để được hoàn tiền đầy đủ (trừ chi phí vận chuyển). Pin phải ở tình trạng ban đầu với đầy đủ bao bì và tài liệu. Phí tái kho có thể được áp dụng cho sản phẩm đã mở.",
    },
    {
      key: "6",
      icon: <CarOutlined />,
      question: "Bạn có cung cấp dịch vụ lắp đặt không?",
      answer:
        "Mặc dù chúng tôi không trực tiếp lắp đặt pin, nhưng chúng tôi hợp tác với các kỹ thuật viên được chứng nhận và trung tâm lắp đặt trên toàn quốc. Khi bạn mua pin, bạn sẽ nhận được danh sách các đối tác lắp đặt được đề xuất trong khu vực của bạn. Một số pin đi kèm với phiếu lắp đặt miễn phí. Lắp đặt chuyên nghiệp được khuyến khích cao vì lý do an toàn và tuân thủ bảo hành.",
    },
    {
      key: "7",
      icon: <QuestionCircleOutlined />,
      question: "Làm thế nào để xác định tình trạng sức khỏe và dung lượng pin?",
      answer:
        "Sức khỏe pin được đánh giá bằng thiết bị chẩn đoán chuyên nghiệp đo State of Health (SOH), State of Charge (SOC), điện trở nội và số chu kỳ. Chúng tôi cung cấp báo cáo sức khỏe chi tiết với mỗi viên pin hiển thị dung lượng hiện tại so với thông số ban đầu. Pin được xếp hạng là Xuất sắc (90-100% sức khỏe), Rất tốt (80-89%), Tốt (70-79%) hoặc Khá (60-69%).",
    },
    {
      key: "8",
      icon: <CarOutlined />,
      question: "Có những tùy chọn vận chuyển nào?",
      answer:
        "Chúng tôi cung cấp vận chuyển tiêu chuẩn (5-7 ngày làm việc), vận chuyển nhanh (2-3 ngày làm việc) và vận chuyển hỏa tốc (ngày hôm sau cho các khu vực được chọn). Tất cả pin đều được đóng gói theo quy định an toàn cho vận chuyển pin lithium-ion. Miễn phí vận chuyển cho đơn hàng trên 120,000,000 ₫. Thông tin theo dõi được cung cấp cho tất cả các lô hàng.",
    },
    {
      key: "9",
      icon: <CustomerServiceOutlined />,
      question: "Làm thế nào để liên hệ hỗ trợ khách hàng?",
      answer:
        "Đội ngũ hỗ trợ khách hàng của chúng tôi làm việc Thứ Hai-Thứ Sáu 9AM-6PM qua điện thoại, email hoặc chat trực tiếp. Chúng tôi cũng cung cấp hỗ trợ khẩn cấp 24/7 cho các vấn đề quan trọng. Bạn có thể liên hệ với chúng tôi tại support@evbattery.com hoặc gọi 1-800-EV-BATTERY. Thời gian phản hồi trung bình dưới 2 giờ trong giờ làm việc.",
    },
    {
      key: "10",
      icon: <SafetyOutlined />,
      question: "Pin của bạn có những chứng nhận gì?",
      answer:
        "Tất cả pin đều được chứng nhận đáp ứng các tiêu chuẩn an toàn ngành bao gồm chứng nhận UL, CE và ISO. Chúng tôi cũng cung cấp tài liệu chứng nhận từ các nhà sản xuất gốc. Mỗi viên pin trải qua quy trình kiểm tra 50 điểm nội bộ của chúng tôi trước khi được niêm yết để bán. Chứng nhận an toàn được hiển thị rõ ràng trên mỗi trang sản phẩm.",
    },
  ];

  return (
    <div className={styles.faqSection}>
      <Card className={styles.faqCard}>
        <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>
            <QuestionCircleOutlined /> Câu hỏi thường gặp
          </h2>
          <p className={styles.faqSubtitle}>
            Tìm câu trả lời cho các câu hỏi thường gặp về mua pin xe điện đã qua sử dụng
          </p>
        </div>

        <Collapse
          accordion
          expandIconPosition="end"
          className={styles.faqCollapse}
          bordered={false}
        >
          {faqs.map((faq) => (
            <Panel
              header={
                <div className={styles.panelHeader}>
                  <span className={styles.questionIcon}>{faq.icon}</span>
                  <span className={styles.questionText}>{faq.question}</span>
                </div>
              }
              key={faq.key}
              className={styles.faqPanel}
            >
              <p className={styles.answer}>{faq.answer}</p>
            </Panel>
          ))}
        </Collapse>

        <div className={styles.contactSupport}>
          <p>Vẫn còn thắc mắc?</p>
          <a href="/contact" className={styles.contactLink}>
            Liên hệ đội ngũ hỗ trợ →
          </a>
        </div>
      </Card>
    </div>
  );
};

export default FAQSection;
