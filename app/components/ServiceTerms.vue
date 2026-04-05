<template>
  <!--
    ╔══════════════════════════════════════════════════════╗
    ║  ServiceTerms.vue — Điều Khoản Dịch Vụ SmartFood    ║
    ║  Nuxt 3 + PrimeVue 4 + CSS thuần (scoped)           ║
    ╚══════════════════════════════════════════════════════╝
  -->
  <div class="st-page" ref="pageRef">

    <!-- ══════════════════════════════════════════════════
         READING PROGRESS BAR (fixed top)
         ══════════════════════════════════════════════════ -->
    <div class="reading-bar" :style="{ width: readingProgress + '%' }" />

    <!-- ══════════════════════════════════════════════════
         SECTION 1 — HERO BANNER
         ══════════════════════════════════════════════════ -->
    <section class="hero-banner" :class="{ visible: heroVisible }">
      <!-- SVG dấu check pattern mờ -->
      <div class="hero-pattern" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="checks" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M10 24 L18 32 L38 16"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
                opacity="0.08"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#checks)" />
        </svg>
      </div>

      <div class="hero-inner">
        <!-- Trái: Icon + Tiêu đề -->
        <div class="hero-left">
          <div class="hero-icon" aria-hidden="true">
            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="4" width="32" height="40" rx="4" stroke="white" stroke-width="2.5" fill="none" />
              <path d="M16 14h16M16 21h16M16 28h10" stroke="white" stroke-width="2.5" stroke-linecap="round" />
              <circle cx="42" cy="42" r="10" fill="white" fill-opacity="0.15" stroke="white" stroke-width="2" />
              <path d="M38 42 L41 45 L46 39" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="hero-text">
            <h1 class="hero-title">Điều Khoản Dịch Vụ</h1>
            <span class="hero-updated">📅 Cập nhật lần cuối: 01/01/2025</span>
          </div>
        </div>

        <!-- Phải: 3 badge -->
        <div class="hero-badges">
          <span class="hero-badge">📄 8 Điều khoản</span>
          <span class="hero-badge">🔒 Minh bạch</span>
          <span class="hero-badge">✅ Rõ ràng</span>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         MOBILE: Dropdown chuyển mục (ẩn ở desktop)
         ══════════════════════════════════════════════════ -->
    <div class="mobile-nav">
      <label class="mobile-nav-label">Chuyển đến mục:</label>
      <Select
        v-model="mobileSection"
        :options="sections"
        option-label="title"
        option-value="id"
        placeholder="Chọn điều khoản..."
        class="mobile-nav-select"
        @change="scrollToSection(mobileSection)"
      />
    </div>

    <!-- ══════════════════════════════════════════════════
         LAYOUT CHÍNH — 2 CỘT
         ══════════════════════════════════════════════════ -->
    <div class="main-layout">

      <!-- ─── SIDEBAR (30%) ──────────────────────────── -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <!-- Sidebar progress bar -->
          <div class="sidebar-progress-wrap">
            <div class="sidebar-progress-bar" :style="{ width: readingProgress + '%' }" />
          </div>

          <div class="sidebar-header">
            <svg viewBox="0 0 20 20" fill="#F97316" class="sidebar-icon">
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="sidebar-title">Mục Lục</span>
          </div>

          <nav class="sidebar-nav">
            <button
              v-for="sec in sections"
              :key="sec.id"
              class="sidebar-link"
              :class="{ active: activeSection === sec.id }"
              @click="scrollToSection(sec.id)"
            >
              <span class="sidebar-num">{{ sec.num }}</span>
              <span class="sidebar-link-text">{{ sec.title }}</span>
            </button>
          </nav>
        </div>

        <!-- Cần hỗ trợ? -->
        <div class="support-card">
          <div class="support-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" class="support-svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="support-text">
            <p class="support-title">Cần hỗ trợ?</p>
            <p class="support-sub">Đội ngũ SmartFood sẵn sàng giải đáp</p>
          </div>
          <button class="btn-support" @click="goToSupport">Liên hệ ngay</button>
        </div>
      </aside>

      <!-- ─── NỘI DUNG (70%) ─────────────────────────── -->
      <main class="content-area">

        <!-- §1 Giới thiệu & Định nghĩa -->
        <section id="sec-1" class="term-section reveal" ref="el => sectionRefs['sec-1'] = el">
          <div class="sec-header">
            <span class="sec-num">1</span>
            <h2 class="sec-title">Giới Thiệu &amp; Định Nghĩa</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <p>
              <strong>SmartFood</strong> (tên đầy đủ: Công ty TNHH SmartFood Việt Nam) là nền tảng thương mại điện tử
              chuyên cung cấp thực phẩm sạch, tươi ngon và an toàn, kết nối trực tiếp từ nông trại đến bàn ăn của
              người tiêu dùng Việt Nam. Việc sử dụng dịch vụ của SmartFood đồng nghĩa với việc bạn đồng ý tuân thủ
              các Điều Khoản Dịch Vụ được quy định dưới đây.
            </p>
            <p>Trong văn bản này, các thuật ngữ sau được hiểu như sau:</p>
            <ul class="term-list">
              <li><strong>Người dùng / Khách hàng</strong>: Cá nhân hoặc tổ chức truy cập, đăng ký và sử dụng dịch vụ của SmartFood.</li>
              <li><strong>Dịch vụ</strong>: Tất cả các tính năng, tiện ích và nội dung được cung cấp qua Nền tảng SmartFood.</li>
              <li><strong>Nền tảng</strong>: Website smartfood.vn, ứng dụng di động SmartFood và các kênh phân phối chính thức khác.</li>
              <li><strong>Đơn hàng</strong>: Yêu cầu mua hàng được Người dùng tạo ra và được SmartFood xác nhận thành công.</li>
              <li><strong>Nội dung</strong>: Hình ảnh, văn bản, video, đánh giá sản phẩm và mọi thông tin xuất hiện trên Nền tảng.</li>
            </ul>
            <div class="highlight-box">
              <span class="highlight-icon">⚠️</span>
              <div>
                <p class="highlight-text">
                  <strong>Lưu ý quan trọng:</strong> Điều khoản này có hiệu lực ngay khi bạn bắt đầu sử dụng bất kỳ
                  tính năng nào của SmartFood, kể cả khi bạn chưa đăng ký tài khoản. Bằng cách tiếp tục sử dụng dịch
                  vụ, bạn xác nhận đã đọc, hiểu và đồng ý với toàn bộ nội dung trong Điều Khoản này.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- §2 Điều kiện sử dụng -->
        <section id="sec-2" class="term-section reveal" ref="el => sectionRefs['sec-2'] = el">
          <div class="sec-header">
            <span class="sec-num">2</span>
            <h2 class="sec-title">Điều Kiện Sử Dụng Dịch Vụ</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <p>
              Để sử dụng dịch vụ SmartFood, bạn phải đáp ứng các điều kiện sau đây. SmartFood có quyền từ chối cung
              cấp dịch vụ hoặc chấm dứt tài khoản nếu phát hiện vi phạm.
            </p>
            <ul class="term-list">
              <li><strong>Độ tuổi:</strong> Bạn phải đủ 18 tuổi trở lên, hoặc có sự đồng ý bằng văn bản của cha mẹ/người giám hộ hợp pháp nếu dưới 18 tuổi.</li>
              <li><strong>Mục đích hợp pháp:</strong> Dịch vụ chỉ được sử dụng cho mục đích cá nhân, gia đình hợp pháp. Nghiêm cấm sử dụng để buôn bán, trung gian hoặc các hoạt động bất hợp pháp theo pháp luật Việt Nam.</li>
              <li><strong>Thông tin chính xác:</strong> Bạn cam kết cung cấp thông tin đăng ký, giao nhận và thanh toán đầy đủ, trung thực và chính xác. SmartFood không chịu trách nhiệm về thiệt hại phát sinh do thông tin sai lệch.</li>
              <li><strong>Tuân thủ pháp luật:</strong> Mọi hành vi sử dụng nền tảng phải tuân thủ quy định pháp luật Việt Nam và không xâm phạm quyền lợi của bên thứ ba.</li>
            </ul>
            <div class="highlight-box">
              <span class="highlight-icon">⚠️</span>
              <div>
                <p class="highlight-text">SmartFood có quyền kiểm tra và xác minh thông tin người dùng bất kỳ lúc nào để đảm bảo tính hợp lệ. Tài khoản cung cấp thông tin giả mạo sẽ bị xóa ngay lập tức.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- §3 Tài khoản người dùng -->
        <section id="sec-3" class="term-section reveal" ref="el => sectionRefs['sec-3'] = el">
          <div class="sec-header">
            <span class="sec-num">3</span>
            <h2 class="sec-title">Tài Khoản Người Dùng</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <p>
              Tài khoản SmartFood là cổng vào để bạn trải nghiệm toàn bộ dịch vụ. Việc bảo mật tài khoản là trách
              nhiệm của người dùng.
            </p>
            <ul class="term-list">
              <li><strong>Đăng ký:</strong> Mỗi người chỉ được sở hữu một tài khoản. Việc tạo nhiều tài khoản để lạm dụng khuyến mãi là vi phạm nghiêm trọng.</li>
              <li><strong>Bảo mật mật khẩu:</strong> Bạn chịu hoàn toàn trách nhiệm về mọi hoạt động xảy ra dưới tài khoản của mình. Hãy sử dụng mật khẩu mạnh và bật xác thực 2 yếu tố (2FA) khi có thể.</li>
              <li><strong>Không chia sẻ tài khoản:</strong> Tài khoản là cá nhân, không được chuyển nhượng, cho thuê hoặc chia sẻ với bất kỳ ai khác.</li>
              <li><strong>Bảo vệ thông tin:</strong> Nếu phát hiện dấu hiệu xâm nhập trái phép, hãy đặt lại mật khẩu ngay và liên hệ SmartFood qua hotline 1800.5858.</li>
            </ul>
            <p>
              SmartFood có quyền tạm khóa, hạn chế hoặc xóa tài khoản mà không cần báo trước nếu xác định tài khoản
              vi phạm Điều Khoản này, có hành vi gian lận hoặc gây hại cho người dùng khác hoặc nền tảng.
            </p>
          </div>
        </section>

        <!-- §4 Đặt hàng & Thanh toán -->
        <section id="sec-4" class="term-section reveal" ref="el => sectionRefs['sec-4'] = el">
          <div class="sec-header">
            <span class="sec-num">4</span>
            <h2 class="sec-title">Quy Định Đặt Hàng &amp; Thanh Toán</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <p>
              Mỗi đơn hàng trên SmartFood trải qua quy trình xác nhận chặt chẽ để đảm bảo quyền lợi tối đa cho khách
              hàng.
            </p>
            <ul class="term-list">
              <li><strong>Quy trình đặt hàng:</strong> Chọn sản phẩm → Thêm vào giỏ hàng → Nhập địa chỉ giao hàng → Chọn phương thức thanh toán → Xác nhận đặt hàng. Đơn hàng chính thức khi bạn nhận được email/SMS xác nhận từ SmartFood.</li>
              <li><strong>Giá sản phẩm:</strong> Giá hiển thị đã bao gồm VAT (trừ khi có thông báo khác). SmartFood có quyền điều chỉnh giá bất kỳ lúc nào, nhưng giá tại thời điểm bạn xác nhận đơn sẽ được áp dụng.</li>
              <li><strong>Phương thức thanh toán:</strong> Tiền mặt khi nhận hàng (COD), thẻ ATM nội địa, VISA/Mastercard, ví điện tử MoMo, ZaloPay, VNPay, chuyển khoản ngân hàng.</li>
              <li><strong>Hóa đơn điện tử:</strong> Được gửi qua email trong vòng 24 giờ sau khi giao hàng thành công. Yêu cầu hóa đơn VAT doanh nghiệp vui lòng cung cấp thông tin trước khi đặt hàng.</li>
            </ul>
            <div class="highlight-box">
              <span class="highlight-icon">⚠️</span>
              <div>
                <p class="highlight-text">
                  Bạn có thể hủy đơn hàng trong vòng <strong>30 phút</strong> kể từ khi đặt thành công. Sau thời gian này,
                  đơn hàng đã được xử lý và không thể hủy qua ứng dụng — vui lòng liên hệ hotline ngay.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- §5 Chính sách giao hàng -->
        <section id="sec-5" class="term-section reveal" ref="el => sectionRefs['sec-5'] = el">
          <div class="sec-header">
            <span class="sec-num">5</span>
            <h2 class="sec-title">Chính Sách Giao Hàng</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <p>
              SmartFood cam kết giao hàng nhanh, đúng giờ và đảm bảo chất lượng sản phẩm trong suốt quá trình vận
              chuyển nhờ hệ thống chuỗi lạnh tiêu chuẩn.
            </p>
            <ul class="term-list">
              <li><strong>Phạm vi giao hàng:</strong> Hiện tại phục vụ nội thành Đà Nẵng (giao trong ngày), Quảng Nam và Thừa Thiên Huế (1–2 ngày). Toàn quốc qua đối tác vận chuyển (2–5 ngày làm việc).</li>
              <li><strong>Thời gian giao:</strong> Đơn đặt trước 15:00 được giao trong ngày (nội thành). Đơn đặt sau 15:00 giao vào sáng hôm sau. Bạn có thể chọn khung giờ giao thuận tiện khi thanh toán.</li>
              <li><strong>Phí giao hàng:</strong> Miễn phí với đơn từ 200.000đ (nội thành). Đơn dưới 200.000đ phí 15.000đ. Giao hàng ngoại thành và tỉnh thành khác xem tại trang thanh toán.</li>
              <li><strong>Giao hàng thất bại:</strong> Nếu shipper không thể liên lạc sau 2 lần thử, đơn hàng sẽ bị hủy và hoàn tiền (nếu đã thanh toán trước). SmartFood không chịu trách nhiệm nếu lỗi do địa chỉ không chính xác hoặc không có người nhận.</li>
            </ul>
          </div>
        </section>

        <!-- §6 Đổi trả & Hoàn tiền -->
        <section id="sec-6" class="term-section reveal" ref="el => sectionRefs['sec-6'] = el">
          <div class="sec-header">
            <span class="sec-num">6</span>
            <h2 class="sec-title">Đổi Trả &amp; Hoàn Tiền</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <p>
              SmartFood cam kết hoàn tiền 100% hoặc đổi hàng mới trong trường hợp sản phẩm không đạt chất lượng
              cam kết. Dưới đây là chính sách chi tiết:
            </p>
            <ul class="term-list">
              <li><strong>Điều kiện đổi trả:</strong> Trong vòng <strong>24 giờ</strong> kể từ khi nhận hàng. Sản phẩm phải còn nguyên trạng, chưa qua sử dụng (trừ trường hợp phát hiện hư hỏng khi mở bao bì).</li>
              <li><strong>Các lý do được chấp nhận:</strong> Sản phẩm hư hỏng, ôi thiu, không đúng chủng loại/trọng lượng theo mô tả, thiếu hàng so với đơn đặt.</li>
              <li><strong>Quy trình:</strong> Chụp ảnh sản phẩm → Liên hệ hotline hoặc chat Zalo OA → Được xác nhận → Shipper đến lấy (miễn phí) → Đổi hàng mới hoặc hoàn tiền.</li>
              <li><strong>Thời gian hoàn tiền:</strong> Ví điện tử: 5–15 phút. Thẻ ngân hàng: 3–7 ngày làm việc. COD: Chuyển khoản trong 24 giờ làm việc.</li>
            </ul>
            <div class="highlight-box">
              <span class="highlight-icon">⚠️</span>
              <div>
                <p class="highlight-text">
                  Các sản phẩm đã qua sử dụng, tươi sống đã mở bao bì không do lỗi SmartFood, hoặc sản phẩm trong
                  chương trình khuyến mãi đặc biệt (ghi rõ không đổi trả) sẽ không được áp dụng chính sách này.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- §7 Quyền & Nghĩa vụ -->
        <section id="sec-7" class="term-section reveal" ref="el => sectionRefs['sec-7'] = el">
          <div class="sec-header">
            <span class="sec-num">7</span>
            <h2 class="sec-title">Quyền Và Nghĩa Vụ Các Bên</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <p class="subsec-label">Quyền của SmartFood:</p>
            <ul class="term-list">
              <li>Điều chỉnh giá sản phẩm, phí dịch vụ tại bất kỳ thời điểm nào sau khi thông báo trước ít nhất 7 ngày qua email hoặc thông báo trên nền tảng.</li>
              <li>Tạm ngừng, giới hạn hoặc chấm dứt cung cấp dịch vụ vì lý do kỹ thuật, bảo trì, hoặc vi phạm điều khoản.</li>
              <li>Thay đổi, bổ sung hoặc hủy bỏ các chương trình khuyến mãi mà không cần báo trước.</li>
              <li>Thu thập và sử dụng dữ liệu người dùng (ẩn danh) để cải thiện sản phẩm và dịch vụ theo Chính Sách Bảo Mật.</li>
            </ul>
            <p class="subsec-label">Nghĩa vụ của SmartFood:</p>
            <ul class="term-list">
              <li>Cung cấp sản phẩm đúng mô tả, đảm bảo chất lượng và an toàn thực phẩm theo quy định Bộ Y tế.</li>
              <li>Bảo mật thông tin cá nhân và dữ liệu giao dịch của người dùng theo tiêu chuẩn bảo mật HTTPS và mã hóa đầu cuối.</li>
              <li>Phản hồi khiếu nại của người dùng trong vòng 24 giờ trong giờ làm việc (8h–22h hàng ngày).</li>
              <li>Thông báo kịp thời về các thay đổi quan trọng liên quan đến dịch vụ, giá cả và chính sách.</li>
            </ul>
          </div>
        </section>

        <!-- §8 Điều khoản chung -->
        <section id="sec-8" class="term-section reveal" ref="el => sectionRefs['sec-8'] = el">
          <div class="sec-header">
            <span class="sec-num">8</span>
            <h2 class="sec-title">Điều Khoản Chung</h2>
          </div>
          <div class="sec-divider" />
          <div class="sec-body">
            <ul class="term-list">
              <li><strong>Luật áp dụng:</strong> Điều Khoản Dịch Vụ này chịu sự điều chỉnh và giải thích theo pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.</li>
              <li><strong>Giải quyết tranh chấp:</strong> Các bên ưu tiên giải quyết tranh chấp bằng thương lượng, hòa giải. Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án nhân dân có thẩm quyền tại Đà Nẵng.</li>
              <li><strong>Liên hệ pháp lý:</strong> Mọi thông báo pháp lý gửi về: Công ty TNHH SmartFood Việt Nam, 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng. Email: legal@smartfood.vn.</li>
              <li><strong>Hiệu lực điều khoản:</strong> Nếu bất kỳ điều khoản nào bị tuyên bố vô hiệu theo quy định pháp luật, các điều khoản còn lại vẫn giữ nguyên hiệu lực đầy đủ.</li>
              <li><strong>Cập nhật điều khoản:</strong> SmartFood có thể sửa đổi Điều Khoản bất kỳ lúc nào. Phiên bản mới nhất luôn được đăng tải tại smartfood.vn/dieu-khoan. Việc tiếp tục sử dụng dịch vụ sau ngày cập nhật đồng nghĩa với việc chấp nhận điều khoản mới.</li>
            </ul>
            <div class="highlight-box">
              <span class="highlight-icon">⚠️</span>
              <div>
                <p class="highlight-text">
                  Điều Khoản này được cập nhật lần cuối ngày <strong>01/01/2025</strong> và có hiệu lực ngay từ ngày
                  đó. Mọi giao dịch thực hiện trước ngày này vẫn chịu sự điều chỉnh của phiên bản điều khoản tương
                  ứng tại thời điểm giao dịch.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- ══════════════════════════════════════════════════
             CTA SECTION
             ══════════════════════════════════════════════════ -->
        <div class="cta-box reveal" ref="el => sectionRefs['cta'] = el">
          <div class="cta-text-wrap">
            <div class="cta-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none" class="cta-icon">
                <circle cx="20" cy="20" r="18" fill="#FFF7ED" stroke="#F97316" stroke-width="2" />
                <path d="M13 20l5 5 9-10" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <p class="cta-main">Bằng việc sử dụng dịch vụ SmartFood, bạn xác nhận đã đọc và đồng ý với toàn bộ các Điều Khoản trên.</p>
              <p class="cta-sub">Điều khoản có hiệu lực từ ngày 01/01/2025</p>
            </div>
          </div>
          <div class="cta-actions">
            <button class="btn-agree" @click="handleAgree">✓ Tôi đồng ý</button>
            <button class="btn-consult" @click="goToSupport">Liên hệ tư vấn</button>
          </div>
          <div class="cta-download">
            <button class="download-link" @click="handleDownload">
              <svg viewBox="0 0 16 16" fill="none" class="download-icon">
                <path d="M8 1v9M4 7l4 4 4-4M2 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Tải xuống PDF
            </button>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// ══════════════════════════════════════════════════════════
// DANH SÁCH CÁC SECTION
// ══════════════════════════════════════════════════════════
const sections = [
  { id: "sec-1", num: "§1", title: "Giới thiệu & Định nghĩa" },
  { id: "sec-2", num: "§2", title: "Điều kiện sử dụng dịch vụ" },
  { id: "sec-3", num: "§3", title: "Tài khoản người dùng" },
  { id: "sec-4", num: "§4", title: "Quy định đặt hàng & thanh toán" },
  { id: "sec-5", num: "§5", title: "Chính sách giao hàng" },
  { id: "sec-6", num: "§6", title: "Đổi trả & Hoàn tiền" },
  { id: "sec-7", num: "§7", title: "Quyền và nghĩa vụ các bên" },
  { id: "sec-8", num: "§8", title: "Điều khoản chung" },
];

// ══════════════════════════════════════════════════════════
// TRẠNG THÁI
// ══════════════════════════════════════════════════════════
const heroVisible = ref(false);
const readingProgress = ref(0);
const activeSection = ref("sec-1");
const mobileSection = ref("sec-1");

// ══════════════════════════════════════════════════════════
// SCROLL PROGRESS + SCROLL SPY
// ══════════════════════════════════════════════════════════
const handleScroll = () => {
  // Reading progress (0 → 100%)
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  readingProgress.value = docHeight > 0
    ? Math.round((scrollTop / docHeight) * 100)
    : 0;

  // Scroll spy: tìm section đang ở vùng nhìn thấy
  let currentId = "sec-1";
  for (const sec of sections) {
    const el = document.getElementById(sec.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120) currentId = sec.id;
    }
  }
  activeSection.value = currentId;
  mobileSection.value = currentId;
};

// ══════════════════════════════════════════════════════════
// SMOOTH SCROLL ĐẾN SECTION
// ══════════════════════════════════════════════════════════
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
    activeSection.value = id;
  }
};

// ══════════════════════════════════════════════════════════
// SCROLL REVEAL (IntersectionObserver)
// ══════════════════════════════════════════════════════════
const observeEl = (el: Element) => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  obs.observe(el);
};

// ══════════════════════════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════════════════════════
const goToSupport = () => router.push("/support");
const handleAgree = () => router.push("/");
const handleDownload = () => {
  // Placeholder: sẽ gọi API xuất PDF thực tế
  alert("Chức năng tải PDF sẽ sớm ra mắt!");
};

// ══════════════════════════════════════════════════════════
// LIFECYCLE
// ══════════════════════════════════════════════════════════
onMounted(() => {
  // Hero animation
  setTimeout(() => {
    heroVisible.value = true;
  }, 80);

  // Scroll reveal cho tất cả .reveal
  document.querySelectorAll(".reveal").forEach((el) => observeEl(el));

  // Scroll events
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // init
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════
   READING BAR — fixed top
   ══════════════════════════════════════════════════════════ */
.reading-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #f97316, #ea580c);
  z-index: 9999;
  transition: width 0.15s ease;
  border-radius: 0 2px 2px 0;
}

/* ══════════════════════════════════════════════════════════
   PAGE WRAPPER
   ══════════════════════════════════════════════════════════ */
.st-page {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
  color: #1f2937;
  background: #ffffff;
  min-height: 100vh;
}

/* ══════════════════════════════════════════════════════════
   HERO BANNER
   ══════════════════════════════════════════════════════════ */
.hero-banner {
  position: relative;
  height: 180px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  display: flex;
  align-items: center;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.hero-banner.visible {
  opacity: 1;
  transform: none;
}
.hero-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.hero-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.hero-icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.hero-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: white;
  margin: 0 0 0.375rem;
  line-height: 1.2;
}
.hero-updated {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.2rem 0.75rem;
  border-radius: 9999px;
}
.hero-badges {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-end;
}
.hero-badge {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.25rem 0.875rem;
  border-radius: 9999px;
  white-space: nowrap;
}

/* ══════════════════════════════════════════════════════════
   MOBILE NAV DROPDOWN (hiện ở mobile, ẩn ở desktop)
   ══════════════════════════════════════════════════════════ */
.mobile-nav {
  display: none;
  align-items: center;
  gap: 0.75rem;
  max-width: 1200px;
  margin: 1.25rem auto 0;
  padding: 0 1.25rem;
}
.mobile-nav-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}
.mobile-nav-select {
  flex: 1;
}

/* ══════════════════════════════════════════════════════════
   MAIN LAYOUT: 2 CỘT
   ══════════════════════════════════════════════════════════ */
.main-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
  display: grid;
  grid-template-columns: 30% 1fr;
  gap: 2rem;
  align-items: start;
}

/* ── SIDEBAR ───────────────────────────────────────────── */
.sidebar {
  position: sticky;
  top: 5.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sidebar-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Sidebar progress bar (mỏng phía trên) */
.sidebar-progress-wrap {
  height: 3px;
  background: #f3f4f6;
}
.sidebar-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #ea580c);
  transition: width 0.15s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1.5px solid #f3f4f6;
}
.sidebar-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}
.sidebar-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #111827;
}

.sidebar-nav {
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 500;
  text-align: left;
  border-left: 3px solid transparent;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.sidebar-link:hover {
  background: #fff7ed;
  color: #f97316;
}
.sidebar-link.active {
  background: #fff7ed;
  border-left-color: #f97316;
  color: #ea580c;
  font-weight: 700;
}
.sidebar-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: #f97316;
  font-family: monospace;
  min-width: 2.25rem;
}
.sidebar-link.active .sidebar-num {
  color: #ea580c;
}

/* Card hỗ trợ phía dưới sidebar */
.support-card {
  background: #fff7ed;
  border: 1.5px solid #fed7aa;
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}
.support-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
}
.support-svg {
  width: 1.375rem;
  height: 1.375rem;
}
.support-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}
.support-sub {
  font-size: 0.77rem;
  color: #6b7280;
  margin: 0;
}
.btn-support {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1.125rem;
  cursor: pointer;
  margin-top: 0.25rem;
  box-shadow: 0 3px 12px rgba(249, 115, 22, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-support:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(249, 115, 22, 0.45);
}

/* ── CONTENT AREA ──────────────────────────────────────── */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Scroll Reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ── TERM SECTION ──────────────────────────────────────── */
.term-section {
  padding: 2.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}
.term-section:last-of-type {
  border-bottom: none;
}

.sec-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.sec-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  min-width: 2.25rem;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-size: 0.9rem;
  font-weight: 900;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(249, 115, 22, 0.35);
}
.sec-title {
  font-size: 1.3125rem;
  font-weight: 900;
  color: #111827;
  margin: 0;
}
.sec-divider {
  height: 2px;
  background: linear-gradient(90deg, #fed7aa, transparent);
  border-radius: 1px;
  margin-bottom: 1.375rem;
}

.sec-body p {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: #374151;
  margin: 0 0 1rem;
}
.subsec-label {
  font-size: 0.875rem !important;
  font-weight: 700 !important;
  color: #f97316 !important;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 1.25rem !important;
}

.term-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.term-list li {
  font-size: 0.9375rem;
  line-height: 1.75;
  color: #374151;
  padding-left: 1.375rem;
  position: relative;
}
.term-list li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #f97316;
  font-size: 0.875rem;
  top: 0.05rem;
}

/* Highlight box */
.highlight-box {
  display: flex;
  gap: 0.875rem;
  background: #fff7ed;
  border-left: 4px solid #f97316;
  border-radius: 0 10px 10px 0;
  padding: 1rem 1.25rem;
  margin-top: 1.25rem;
}
.highlight-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  line-height: 1.3;
}
.highlight-text {
  font-size: 0.875rem !important;
  line-height: 1.7 !important;
  color: #92400e !important;
  margin: 0 !important;
}

/* ── CTA BOX ───────────────────────────────────────────── */
.cta-box {
  background: #fff7ed;
  border: 1.5px solid #fed7aa;
  border-radius: 1.5rem;
  padding: 2rem 2rem 1.5rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.cta-text-wrap {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.cta-icon-wrap {
  flex-shrink: 0;
}
.cta-icon {
  width: 2.5rem;
  height: 2.5rem;
}
.cta-main {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.65;
  margin: 0 0 0.25rem;
}
.cta-sub {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}
.cta-actions {
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
}
.btn-agree {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.75rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}
.btn-agree:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.5);
}
.btn-consult {
  background: white;
  color: #f97316;
  font-size: 0.9rem;
  font-weight: 700;
  border: 2px solid #f97316;
  border-radius: 12px;
  padding: 0.75rem 1.75rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-consult:hover {
  background: #f97316;
  color: white;
}
.cta-download {
  text-align: center;
}
.download-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: #f97316;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s;
}
.download-link:hover {
  color: #ea580c;
}
.download-icon {
  width: 1rem;
  height: 1rem;
}

/* ══════════════════════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  /* Ẩn sidebar, hiển thị mobile dropdown */
  .sidebar {
    display: none;
  }
  .mobile-nav {
    display: flex;
  }
  .main-layout {
    grid-template-columns: 1fr;
    padding-top: 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    height: auto;
    padding: 2rem 1rem;
  }
  .hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .hero-title {
    font-size: 1.5rem;
  }
  .hero-badges {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .cta-text-wrap {
    flex-direction: column;
  }
  .term-section {
    padding: 2rem 0;
  }
}

@media (max-width: 480px) {
  .main-layout {
    padding: 1.25rem 1rem 3rem;
  }
  .cta-actions {
    flex-direction: column;
  }
  .btn-agree,
  .btn-consult {
    width: 100%;
    text-align: center;
  }
}
</style>
