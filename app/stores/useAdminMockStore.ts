  import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ProductMock {
  id: string
  _id?: string
  title: string
  slug: string
  description: string
  thumbnail: string
  images: string[]
  stock: number
  unit: 'kg' | 'g' | 'hộp' | 'chai' | 'gói' | 'túi' | 'cái' | 'lốc' | 'combo'
  price: number
  discountPercentage: number
  originalPrice: number
  status: 'active' | 'inactive'
  featured: boolean
  isBestPrice: boolean
  isOnlineExclusive: boolean
  tags: string[]
  ratings: {
    totalRating: number
    numberOfRatings: number
  }
  soldCount: number
  primary_category_id: string
  updatedAt?: string
}

export interface CategoryMock {
  id: string
  _id?: string
  title: string
  slug: string
  type: 'product' | 'article'
  description: string
  thumbnail: string
  bannerImage: string
  badgeText: string
  status: 'active' | 'inactive'
  featured: boolean
  position: number
  parent_id: string | null
  updatedAt?: string
}

export interface OrderMock {
  id: string
  _id?: string
  userId: string
  userInfo: {
    fullname: string
    phone: string
    address: string
    ward: string
    district: string
    province: string
    note: string
  }
  orderCode: number
  voucherCode: string
  discountVoucher: number
  shippingFee: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'returned'
  deliveredAt: string | null
  createdAt: string
}

export interface PaymentMock {
  id: string
  _id?: string
  orderId: string
  userId: string
  paymentMethod: 'COD' | 'PayOS'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'cancelled'
  transactionId: string
  paymentUrl: string
  createdAt?: string
}

export interface VoucherMock {
  id: string
  _id?: string
  code: string
  name: string
  description: string
  type: 'money' | 'percent' | 'freeship' | 'product'
  discountValue: number
  maxDiscountAmount: number
  minOrderValue: number
  applyFor: 'all' | 'category' | 'product'
  applyForIds: string[]
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'expired'
  quantity: number
  usedCount: number
  usageLimitPerUser: number
  isFeatured: boolean
}

export interface ArticleMock {
  id: string
  _id?: string
  title: string
  slug: string
  shortDescription: string
  content: string
  thumbnail: string
  authorName: string
  readTime: number
  views: number
  publishedAt: string
  status: 'active' | 'draft' | 'inactive'
  featured: boolean
  position: number
  primary_category_id: string
  tags: string[]
}

export interface UserMock {
  id: string
  _id?: string
  email: string
  displayName: string
  phone: string
  avatar: string
  role: 'client' | 'admin'
  roleId: string
  address: string
  gender: string
  birthday: string
  isActive: boolean
}

export interface RoleMock {
  id: string
  _id?: string
  title: string
  description: string
  permissions: string[]
}

export interface SettingsMock {
  websiteName: string
  logo: string
  phone: string
  email: string
  address: string
  copyright: string
}

export interface RefundItemMock {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface RefundRequestMock {
  id: string
  _id?: string
  orderId: string
  userId: string
  customerName: string
  amount: number
  reason: string
  images: string[]
  videos: string[]
  items: RefundItemMock[]
  bankInfo: {
    bankName: string
    accountNumber: string
    accountHolder: string
  } | null
  status: 'pending' | 'approved_waiting_pickup' | 'processing_refund' | 'completed' | 'rejected'
  refundMethod?: 'bank_transfer' | 'cash_on_pickup'
  rejectReason: string
  createdAt: string
  updatedAt: string | null
}

export interface ReviewMock {
  id: string
  _id?: string
  productId: string
  productName: string
  userId: string
  customerName: string
  rating: number
  comment: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string | null
}

export const useAdminMockStore = defineStore('adminMock', () => {
  // --- Products Mock Data ---
  const products = ref<ProductMock[]>([
    {
      id: 'prod-1',
      title: 'Hộp Cơm Cá Hồi Áp Chảo',
      slug: 'hop-com-ca-hoi-ap-chao',
      description: '<p>Cá hồi tươi áp chảo xốt teriyaki đậm đà kết hợp rau củ luộc thanh mát và cơm gạo lứt bổ dưỡng.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop'
      ],
      stock: 45,
      unit: 'hộp',
      price: 135000,
      discountPercentage: 10,
      originalPrice: 150000,
      status: 'active',
      featured: true,
      isBestPrice: true,
      isOnlineExclusive: false,
      tags: ['Salmon', 'Brown Rice', 'Healthy'],
      ratings: { totalRating: 4.8, numberOfRatings: 24 },
      soldCount: 120,
      primary_category_id: 'cat-1',
      updatedAt: '2026-05-18T10:30:00.000Z'
    },
    {
      id: 'prod-2',
      title: 'Salad Ức Gà Sốt Mè Rang',
      slug: 'salad-uc-ga-sot-me-rang',
      description: '<p>Ức gà áp chảo mềm mọng, xà lách romaine giòn ngọt, cà chua cherry kết hợp nước xốt mè rang Nhật Bản thơm béo.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop'
      ],
      stock: 30,
      unit: 'combo',
      price: 79000,
      discountPercentage: 0,
      originalPrice: 79000,
      status: 'active',
      featured: false,
      isBestPrice: false,
      isOnlineExclusive: true,
      tags: ['Chicken', 'Salad', 'Diet'],
      ratings: { totalRating: 4.5, numberOfRatings: 18 },
      soldCount: 85,
      primary_category_id: 'cat-1',
      updatedAt: '2026-05-19T08:15:00.000Z'
    },
    {
      id: 'prod-3',
      title: 'Nước Ép Thải Độc Cần Tây Táo',
      slug: 'nuoc-ep-thai-doc-can-tay-tao',
      description: '<p>Nước ép nguyên chất từ cần tây hữu cơ, táo xanh giòn và một chút chanh vàng giúp thanh lọc cơ thể.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop'
      ],
      stock: 15,
      unit: 'chai',
      price: 49000,
      discountPercentage: 5,
      originalPrice: 52000,
      status: 'active',
      featured: true,
      isBestPrice: false,
      isOnlineExclusive: false,
      tags: ['Juice', 'Detox', 'Organic'],
      ratings: { totalRating: 4.7, numberOfRatings: 32 },
      soldCount: 210,
      primary_category_id: 'cat-2',
      updatedAt: '2026-05-20T04:20:00.000Z'
    },
    {
      id: 'prod-4',
      title: 'Bánh Mì Nguyên Cám Bơ Gà',
      slug: 'banh-mi-nguyen-cam-bo-ga',
      description: '<p>Bánh mì đen lúa mạch giàu xơ kẹp bơ quả béo ngậy, ức gà luộc xé phay, xà lách và dưa leo.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop'
      ],
      stock: 0,
      unit: 'cái',
      price: 65000,
      discountPercentage: 0,
      originalPrice: 65000,
      status: 'inactive',
      featured: false,
      isBestPrice: false,
      isOnlineExclusive: false,
      tags: ['Bread', 'Avocado', 'Breakfast'],
      ratings: { totalRating: 4.2, numberOfRatings: 10 },
      soldCount: 40,
      primary_category_id: 'cat-1',
      updatedAt: '2026-05-15T12:00:00.000Z'
    },
    {
      id: 'prod-5',
      title: 'Cơm Đùi Gà Nướng Mật Ong',
      slug: 'com-dui-ga-nuong-mat-ong',
      description: '<p>Đùi gà góc tư ướp mật ong rừng thơm ngọt nướng vàng ruộm, dùng kèm cơm tấm nóng hổi và canh kim chi.</p>',
      thumbnail: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=500&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=500&auto=format&fit=crop'
      ],
      stock: 50,
      unit: 'hộp',
      price: 95000,
      discountPercentage: 15,
      originalPrice: 111764,
      status: 'active',
      featured: false,
      isBestPrice: true,
      isOnlineExclusive: false,
      tags: ['Chicken', 'Honey', 'Rice'],
      ratings: { totalRating: 4.6, numberOfRatings: 48 },
      soldCount: 320,
      primary_category_id: 'cat-3',
      updatedAt: '2026-05-20T09:10:00.000Z'
    }
  ])

  // --- Categories Mock Data ---
  const categories = ref<CategoryMock[]>([
    {
      id: 'cat-1',
      title: 'Đồ Ăn Healthy',
      slug: 'do-an-healthy',
      type: 'product',
      description: 'Các món ăn giàu protein, ít tinh bột xấu, thích hợp cho người tập gym, ăn kiêng.',
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop',
      badgeText: 'Bestseller',
      status: 'active',
      featured: true,
      position: 1,
      parent_id: null,
      updatedAt: '2026-05-18T10:30:00.000Z'
    },
    {
      id: 'cat-2',
      title: 'Đồ Uống Detox',
      slug: 'do-uong-detox',
      type: 'product',
      description: 'Nước ép trái cây tươi và nước thanh lọc cơ thể từ rau quả hữu cơ nguyên chất.',
      thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=1200&auto=format&fit=crop',
      badgeText: 'New',
      status: 'active',
      featured: true,
      position: 2,
      parent_id: null,
      updatedAt: '2026-05-19T08:15:00.000Z'
    },
    {
      id: 'cat-3',
      title: 'Cơm Văn Phòng',
      slug: 'com-van-phong',
      type: 'product',
      description: 'Cơm trưa văn phòng đậm đà hương vị gia đình Việt, đầy đủ dinh dưỡng.',
      thumbnail: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop',
      badgeText: 'Quen Thuộc',
      status: 'active',
      featured: false,
      position: 3,
      parent_id: null,
      updatedAt: '2026-05-20T04:20:00.000Z'
    },
    {
      id: 'cat-4',
      title: 'Tin Tức Dinh Dưỡng',
      slug: 'tin-tuc-dinh-duong',
      type: 'article',
      description: 'Cập nhật kiến thức hữu ích về chế độ ăn uống khoa học và lối sống lành mạnh.',
      thumbnail: 'https://images.unsplash.com/photo-1490812533938-46c69fbc55a4?w=200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1490812533938-46c69fbc55a4?w=1200&auto=format&fit=crop',
      badgeText: 'Hot',
      status: 'active',
      featured: true,
      position: 4,
      parent_id: null,
      updatedAt: '2026-05-15T12:00:00.000Z'
    },
    {
      id: 'cat-5',
      title: 'Review Món Ăn',
      slug: 'review-mon-an',
      type: 'article',
      description: 'Các bài viết giới thiệu chi tiết, đánh giá cảm nhận về thực đơn các món ăn.',
      thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop',
      bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop',
      badgeText: 'Review',
      status: 'inactive',
      featured: false,
      position: 5,
      parent_id: null,
      updatedAt: '2026-05-20T09:10:00.000Z'
    }
  ])

  // --- Orders Mock Data ---
  const orders = ref<OrderMock[]>([
    {
      id: 'ord-1001',
      userId: 'user-1',
      userInfo: {
        fullname: 'Nguyễn Văn Long',
        phone: '0987654321',
        address: 'Số 12 Ngõ 45 Cầu Giấy',
        ward: 'Dịch Vọng',
        district: 'Cầu Giấy',
        province: 'Hà Nội',
        note: 'Giao hàng giờ hành chính, gọi trước khi đến.'
      },
      orderCode: 2026052001,
      voucherCode: 'SMARTFOOD10',
      discountVoucher: 15000,
      shippingFee: 20000,
      totalPrice: 219000,
      status: 'processing',
      deliveredAt: null,
      createdAt: '2026-05-20T08:30:00.000Z'
    },
    {
      id: 'ord-1002',
      userId: 'user-2',
      userInfo: {
        fullname: 'Trần Thị Thu Hà',
        phone: '0912345678',
        address: 'Căn hộ 1508 Tòa S2 Ocean Park',
        ward: 'Đa Tốn',
        district: 'Gia Lâm',
        province: 'Hà Nội',
        note: 'Đồ ăn không cho hành lá.'
      },
      orderCode: 2026052002,
      voucherCode: '',
      discountVoucher: 0,
      shippingFee: 30000,
      totalPrice: 109000,
      status: 'pending',
      deliveredAt: null,
      createdAt: '2026-05-20T10:15:00.000Z'
    },
    {
      id: 'ord-1003',
      userId: 'user-3',
      userInfo: {
        fullname: 'Phạm Minh Đức',
        phone: '0977888999',
        address: 'Tầng 5, Tòa nhà Keangnam Landmark 72',
        ward: 'Mễ Trì',
        district: 'Nam Từ Liêm',
        province: 'Hà Nội',
        note: 'Gửi ở bàn lễ tân tòa nhà.'
      },
      orderCode: 2026051901,
      voucherCode: 'FREESHIP',
      discountVoucher: 25000,
      shippingFee: 25000,
      totalPrice: 270000,
      status: 'delivered',
      deliveredAt: '2026-05-19T12:45:00.000Z',
      createdAt: '2026-05-19T11:00:00.000Z'
    },
    {
      id: 'ord-1004',
      userId: 'user-4',
      userInfo: {
        fullname: 'Lê Hoàng Yến',
        phone: '0933221100',
        address: '124 Lũy Bán Bích',
        ward: 'Tân Thới Hòa',
        district: 'Tân Phú',
        province: 'Hồ Chí Minh',
        note: 'Giao nhanh giúp mình.'
      },
      orderCode: 2026051801,
      voucherCode: 'GIAM20',
      discountVoucher: 40000,
      shippingFee: 15000,
      totalPrice: 175000,
      status: 'cancelled',
      deliveredAt: null,
      createdAt: '2026-05-18T14:20:00.000Z'
    },
    {
      id: 'ord-1005',
      userId: 'user-5',
      userInfo: {
        fullname: 'Vũ Quốc Anh',
        phone: '0966554433',
        address: '45 Trần Hưng Đạo',
        ward: 'Phan Chu Trinh',
        district: 'Hoàn Kiếm',
        province: 'Hà Nội',
        note: 'Nhớ đem theo muỗng nĩa nhựa.'
      },
      orderCode: 2026051701,
      voucherCode: '',
      discountVoucher: 0,
      shippingFee: 20000,
      totalPrice: 320000,
      status: 'delivered',
      deliveredAt: '2026-05-17T18:50:00.000Z',
      createdAt: '2026-05-17T17:30:00.000Z'
    }
  ])

  // --- Payments Mock Data ---
  const payments = ref<PaymentMock[]>([
    {
      id: 'pay-1',
      orderId: 'ord-1001',
      userId: 'user-1',
      paymentMethod: 'PayOS',
      amount: 219000,
      currency: 'VND',
      status: 'completed',
      transactionId: 'TXN20260520001',
      paymentUrl: 'https://pay.payos.vn/web/checkout/ord-1001-mocked',
      createdAt: '2026-05-20T08:32:00.000Z'
    },
    {
      id: 'pay-2',
      orderId: 'ord-1002',
      userId: 'user-2',
      paymentMethod: 'COD',
      amount: 109000,
      currency: 'VND',
      status: 'pending',
      transactionId: 'N/A',
      paymentUrl: '',
      createdAt: '2026-05-20T10:15:00.000Z'
    },
    {
      id: 'pay-3',
      orderId: 'ord-1003',
      userId: 'user-3',
      paymentMethod: 'PayOS',
      amount: 270000,
      currency: 'VND',
      status: 'completed',
      transactionId: 'TXN20260519088',
      paymentUrl: 'https://pay.payos.vn/web/checkout/ord-1003-mocked',
      createdAt: '2026-05-19T11:03:00.000Z'
    },
    {
      id: 'pay-4',
      orderId: 'ord-1004',
      userId: 'user-4',
      paymentMethod: 'PayOS',
      amount: 175000,
      currency: 'VND',
      status: 'cancelled',
      transactionId: 'TXN20260518042',
      paymentUrl: 'https://pay.payos.vn/web/checkout/ord-1004-mocked',
      createdAt: '2026-05-18T14:21:00.000Z'
    },
    {
      id: 'pay-5',
      orderId: 'ord-1005',
      userId: 'user-5',
      paymentMethod: 'COD',
      amount: 320000,
      currency: 'VND',
      status: 'completed',
      transactionId: 'COD-ORD-1005',
      paymentUrl: '',
      createdAt: '2026-05-17T18:50:00.000Z'
    }
  ])

  // --- Vouchers Mock Data ---
  const vouchers = ref<VoucherMock[]>([
    {
      id: 'vouc-1',
      code: 'SMARTFOOD10',
      name: 'Giảm 10k Đơn Trưa',
      description: 'Giảm trực tiếp 10.000 VND cho đơn hàng từ 80k trở lên.',
      type: 'money',
      discountValue: 10000,
      maxDiscountAmount: 10000,
      minOrderValue: 80000,
      applyFor: 'all',
      applyForIds: [],
      startDate: '2026-05-01',
      endDate: '2026-06-30',
      status: 'active',
      quantity: 500,
      usedCount: 142,
      usageLimitPerUser: 1,
      isFeatured: true
    },
    {
      id: 'vouc-2',
      code: 'HEALTHY20',
      name: 'Giảm 20% Đồ Healthy',
      description: 'Giảm 20% tối đa 30k áp dụng riêng cho danh mục Đồ Ăn Healthy.',
      type: 'percent',
      discountValue: 20,
      maxDiscountAmount: 30000,
      minOrderValue: 100000,
      applyFor: 'category',
      applyForIds: ['cat-1'],
      startDate: '2026-05-10',
      endDate: '2026-05-31',
      status: 'active',
      quantity: 200,
      usedCount: 88,
      usageLimitPerUser: 2,
      isFeatured: true
    },
    {
      id: 'vouc-3',
      code: 'FREESHIPMAX',
      name: 'Miễn Phí Vận Chuyển',
      description: 'Miễn phí vận chuyển tối đa 25k cho đơn hàng từ 150k.',
      type: 'freeship',
      discountValue: 25000,
      maxDiscountAmount: 25000,
      minOrderValue: 150000,
      applyFor: 'all',
      applyForIds: [],
      startDate: '2026-04-01',
      endDate: '2026-12-31',
      status: 'active',
      quantity: 1000,
      usedCount: 420,
      usageLimitPerUser: 5,
      isFeatured: false
    },
    {
      id: 'vouc-4',
      code: 'EXPIRED15',
      name: 'Khuyến Mãi Lễ Hội',
      description: 'Giảm 15% tối đa 40k đã hết hạn sử dụng.',
      type: 'percent',
      discountValue: 15,
      maxDiscountAmount: 40000,
      minOrderValue: 120000,
      applyFor: 'all',
      applyForIds: [],
      startDate: '2026-04-01',
      endDate: '2026-05-01',
      status: 'expired',
      quantity: 100,
      usedCount: 100,
      usageLimitPerUser: 1,
      isFeatured: false
    },
    {
      id: 'vouc-5',
      code: 'SALMONLOVE',
      name: 'Khuyến Mãi Đặc Biệt Cá Hồi',
      description: 'Ưu đãi đặc biệt giảm 30k khi mua Bát Cá Hồi Teriyaki.',
      type: 'product',
      discountValue: 30000,
      maxDiscountAmount: 30000,
      minOrderValue: 130000,
      applyFor: 'product',
      applyForIds: ['prod-1'],
      startDate: '2026-05-15',
      endDate: '2026-05-25',
      status: 'active',
      quantity: 50,
      usedCount: 12,
      usageLimitPerUser: 1,
      isFeatured: false
    }
  ])

  // --- Articles Mock Data ---
  const articles = ref<ArticleMock[]>([
    {
      id: 'art-1',
      title: '7 Lợi Ích Của Chế Độ Ăn Eat Clean Bạn Nên Biết',
      slug: '7-loi-ich-cua-che-do-an-eat-clean-ban-nen-biet',
      shortDescription: 'Eat Clean không chỉ giúp giảm cân mà còn mang lại nhiều lợi ích to lớn cho sức khỏe tim mạch và làn da.',
      content: '<p>Chế độ ăn Eat Clean (ăn sạch) tập trung vào việc sử dụng thực phẩm nguyên bản, ít chế biến sẵn. Khi bạn áp dụng chế độ này, cơ thể bạn sẽ được cung cấp dinh dưỡng tốt nhất, giảm tải độc tố cho gan và cải thiện chất lượng cuộc sống rõ rệt...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop',
      authorName: 'Dr. Nguyễn Thanh Sơn',
      readTime: 5,
      views: 1240,
      publishedAt: '2026-05-18T09:00:00.000Z',
      status: 'active',
      featured: true,
      position: 1,
      primary_category_id: 'cat-4',
      tags: ['eatclean', 'health', 'lifestyle']
    },
    {
      id: 'art-2',
      title: 'Tại Sao Cần Tây Trở Thành Cơn Sốt Detox Toàn Cầu?',
      slug: 'tai-sao-can-tay-tro-thanh-con-sot-detox-toan-cau',
      shortDescription: 'Tìm hiểu thực hư về công dụng giảm cân, làm đẹp da vượt trội của nước ép cần tây nguyên chất.',
      content: '<p>Nước ép cần tây chứa hàm lượng chất chống oxy hóa cực cao, vitamin K dồi dào và các khoáng chất vi lượng. Uống nước ép cần tây vào mỗi buổi sáng khi bụng rỗng mang lại những hiệu quả detox đáng kinh ngạc...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop',
      authorName: 'Nutri Hân Nguyễn',
      readTime: 4,
      views: 890,
      publishedAt: '2026-05-19T07:30:00.000Z',
      status: 'active',
      featured: true,
      position: 2,
      primary_category_id: 'cat-4',
      tags: ['detox', 'celery', 'beauty']
    },
    {
      id: 'art-3',
      title: 'Review Thực Đơn Tuần Healthy Từ Bếp SmartFood',
      slug: 'review-thuc-don-tuan-healthy-tu-bep-smartfood',
      shortDescription: 'Trải nghiệm 7 ngày ăn lành mạnh với menu đa dạng các món salad, cơm gạo lứt thơm ngon.',
      content: '<p>Để giúp khách hàng dễ dàng làm quen với lối sống xanh, đầu bếp SmartFood đã thiết kế gói thực đơn 7 ngày đa dạng. Mỗi ngày là một trải nghiệm ẩm thực thú vị mà không lo ngại về lượng calories...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop',
      authorName: 'Chef Minh Tuấn',
      readTime: 6,
      views: 450,
      publishedAt: '2026-05-20T10:00:00.000Z',
      status: 'draft',
      featured: false,
      position: 3,
      primary_category_id: 'cat-5',
      tags: ['review', 'menu', 'smartfood']
    },
    {
      id: 'art-4',
      title: 'Những Sai Lầm Thường Gặp Khi Bắt Đầu Giảm Cân',
      slug: 'nhung-sai-lam-thuong-gap-khi-bat-dau-giam-can',
      shortDescription: 'Nhịn ăn, bỏ bữa hay tập luyện quá sức là những sai lầm phổ biến khiến kế hoạch của bạn thất bại.',
      content: '<p>Nhiều người lầm tưởng việc nhịn ăn sẽ giúp đốt mỡ nhanh chóng. Thực tế, điều này chỉ khiến cơ thể bị suy nhược, giảm cơ bắp và làm chậm quá trình trao đổi chất tự nhiên. Hãy học cách giảm cân an toàn...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop',
      authorName: 'PT Trần Quốc Vinh',
      readTime: 8,
      views: 3100,
      publishedAt: '2026-05-12T14:00:00.000Z',
      status: 'active',
      featured: false,
      position: 4,
      primary_category_id: 'cat-4',
      tags: ['diet', 'workout', 'mistakes']
    },
    {
      id: 'art-5',
      title: 'Cách Tự Làm Xốt Mè Rang Thơm Ngon Tại Nhà',
      slug: 'cach-tu-lam-xot-me-rang-thom-ngon-tai-nha',
      shortDescription: 'Công thức độc quyền tự chế biến xốt mè rang sánh mịn, thơm nức mũi chuẩn vị salad nhà hàng.',
      content: '<p>Xốt mè rang là linh hồn của nhiều món salad hiện đại. Với các nguyên liệu dễ kiếm như hạt mè vàng rang chín, mayonnaise, nước tương, dầu mè và giấm gạo, bạn hoàn toàn có thể tự tay làm hũ xốt cực chất...</p>',
      thumbnail: 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?w=500&auto=format&fit=crop',
      authorName: 'Chef Minh Tuấn',
      readTime: 3,
      views: 620,
      publishedAt: '2026-05-15T15:30:00.000Z',
      status: 'inactive',
      featured: false,
      position: 5,
      primary_category_id: 'cat-5',
      tags: ['sauce', 'recipe', 'cooking']
    }
  ])

  // --- Users Mock Data ---
  const users = ref<UserMock[]>([
    {
      id: 'user-1',
      email: 'longnv@smartfood.vn',
      displayName: 'Nguyễn Văn Long',
      phone: '0987654321',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
      role: 'admin',
      roleId: 'role-1',
      address: 'Số 12 Ngõ 45 Cầu Giấy, Hà Nội',
      gender: 'Male',
      birthday: '1995-10-15',
      isActive: true
    },
    {
      id: 'user-2',
      email: 'hathuthu@gmail.com',
      displayName: 'Trần Thị Thu Hà',
      phone: '0912345678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop',
      role: 'client',
      roleId: 'role-2',
      address: 'Gia Lâm, Hà Nội',
      gender: 'Female',
      birthday: '1998-04-20',
      isActive: true
    },
    {
      id: 'user-3',
      email: 'ducpm@gmail.com',
      displayName: 'Phạm Minh Đức',
      phone: '0977888999',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
      role: 'client',
      roleId: 'role-2',
      address: 'Nam Từ Liêm, Hà Nội',
      gender: 'Male',
      birthday: '1992-07-30',
      isActive: true
    },
    {
      id: 'user-4',
      email: 'yenlh@gmail.com',
      displayName: 'Lê Hoàng Yến',
      phone: '0933221100',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop',
      role: 'client',
      roleId: 'role-2',
      address: 'Tân Phú, Hồ Chí Minh',
      gender: 'Female',
      birthday: '2000-12-05',
      isActive: false
    },
    {
      id: 'user-5',
      email: 'anhquocvu@smartfood.vn',
      displayName: 'Vũ Quốc Anh',
      phone: '0966554433',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
      role: 'admin',
      roleId: 'role-1',
      address: 'Hoàn Kiếm, Hà Nội',
      gender: 'Male',
      birthday: '1996-01-25',
      isActive: true
    }
  ])

  // --- Roles Mock Data ---
  const roles = ref<RoleMock[]>([
    {
      id: 'role-1',
      title: 'Administrator',
      description: 'Quản trị viên toàn hệ thống. Có toàn quyền quản lý sản phẩm, đơn hàng, người dùng và cài đặt chung.',
      permissions: [
        'dashboard.view',
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
        'orders.view', 'orders.edit',
        'vouchers.view', 'vouchers.create', 'vouchers.edit', 'vouchers.delete',
        'payments.view', 'payments.edit',
        'articles.view', 'articles.create', 'articles.edit', 'articles.delete',
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
        'settings.view', 'settings.edit'
      ]
    },
    {
      id: 'role-2',
      title: 'Client User',
      description: 'Khách hàng mua sắm trên website. Có quyền xem sản phẩm, tạo giỏ hàng, đặt hàng và cập nhật trang cá nhân.',
      permissions: [
        'products.view',
        'categories.view',
        'orders.view',
        'articles.view'
      ]
    },
    {
      id: 'role-3',
      title: 'Content Editor',
      description: 'Biên tập viên nội dung. Quản lý các danh mục bài viết, soạn thảo bài viết, tin tức dinh dưỡng.',
      permissions: [
        'dashboard.view',
        'articles.view', 'articles.create', 'articles.edit', 'articles.delete',
        'categories.view'
      ]
    },
    {
      id: 'role-4',
      title: 'Store Manager',
      description: 'Quản lý cửa hàng. Có quyền quản lý sản phẩm, kho hàng, danh mục sản phẩm và xử lý các đơn hàng phát sinh.',
      permissions: [
        'dashboard.view',
        'products.view', 'products.create', 'products.edit',
        'categories.view', 'categories.create', 'categories.edit',
        'orders.view', 'orders.edit'
      ]
    },
    {
      id: 'role-5',
      title: 'Support Agent',
      description: 'Nhân viên chăm sóc khách hàng. Có quyền xem thông tin đơn đặt hàng, hỗ trợ người dùng giải quyết khiếu nại.',
      permissions: [
        'dashboard.view',
        'orders.view',
        'users.view'
      ]
    }
  ])

  // --- Settings Mock Data ---
  const settings = ref<SettingsMock>({
    websiteName: 'SmartFood - Hệ Thống Đồ Ăn Sạch & Thực Dưỡng',
    logo: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop',
    phone: '19001234',
    email: 'contact@smartfood.vn',
    address: 'Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội',
    copyright: '© 2026 SmartFood Co., Ltd. All Rights Reserved.'
  })

  // --- Refund Requests Mock Data ---
  const refundRequests = ref<RefundRequestMock[]>([
    {
      id: 'refund-1',
      orderId: 'ord-1003',
      userId: 'user-3',
      customerName: 'Phạm Minh Đức',
      amount: 135000,
      reason: 'Sản phẩm bị hư hỏng khi nhận hàng, hộp cơm bị móp méo và có mùi lạ.',
      images: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop'
      ],
      videos: [],
      items: [
        { productId: 'prod-1', productName: 'Hộp Cơm Cá Hồi Áp Chảo', quantity: 1, price: 135000 }
      ],
      bankInfo: {
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountHolder: 'PHAM MINH DUC'
      },
      status: 'pending',
      refundMethod: 'bank_transfer',
      rejectReason: '',
      createdAt: '2026-05-20T14:30:00.000Z',
      updatedAt: null
    },
    {
      id: 'refund-2',
      orderId: 'ord-1001',
      userId: 'user-1',
      customerName: 'Nguyễn Văn Long',
      amount: 79000,
      reason: 'Nhân viên giao hàng để salad dưới nắng quá lâu, rau bị héo éo và rót ra khỏi túi.',
      images: [
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop'
      ],
      videos: ['https://www.w3schools.com/html/mov_bbb.mp4'],
      items: [
        { productId: 'prod-2', productName: 'Salad Ức Gà Sốt Mè Rang', quantity: 1, price: 79000 }
      ],
      bankInfo: null,
      status: 'processing_refund',
      refundMethod: 'bank_transfer',
      rejectReason: '',
      createdAt: '2026-05-19T09:00:00.000Z',
      updatedAt: '2026-05-19T10:30:00.000Z'
    },
    {
      id: 'refund-3',
      orderId: 'ord-1005',
      userId: 'user-5',
      customerName: 'Vũ Quốc Anh',
      amount: 320000,
      reason: 'Nhận nhầm món, tôi đặt cơm gà nhưng nhận được cơm cá hồi. Nhà tôi có người dị ứng cá hồi.',
      images: [
        'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop'
      ],
      videos: [],
      items: [
        { productId: 'prod-5', productName: 'Cơm Đùi Gà Nướng Mật Ong', quantity: 2, price: 95000 },
        { productId: 'prod-1', productName: 'Hộp Cơm Cá Hồi Áp Chảo', quantity: 1, price: 135000 }
      ],
      bankInfo: {
        bankName: 'Techcombank',
        accountNumber: '9988776655',
        accountHolder: 'VU QUOC ANH'
      },
      status: 'processing_refund',
      refundMethod: 'bank_transfer',
      rejectReason: '',
      createdAt: '2026-05-18T11:00:00.000Z',
      updatedAt: '2026-05-18T13:00:00.000Z'
    },
    {
      id: 'refund-4',
      orderId: 'ord-1002',
      userId: 'user-2',
      customerName: 'Trần Thị Thu Hà',
      amount: 49000,
      reason: 'Nước ép cần tây bị xuất hiện nấm mốc trong chai, chưa hết hạn sử dụng nhưng đã hu bỏ.',
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop'
      ],
      videos: [],
      items: [
        { productId: 'prod-3', productName: 'Nước Ép Thải Độc Cần Tây Táo', quantity: 1, price: 49000 }
      ],
      bankInfo: {
        bankName: 'MB Bank',
        accountNumber: '0101234567',
        accountHolder: 'TRAN THI THU HA'
      },
      status: 'completed',
      refundMethod: 'bank_transfer',
      rejectReason: '',
      createdAt: '2026-05-17T08:00:00.000Z',
      updatedAt: '2026-05-17T16:00:00.000Z'
    },
    {
      id: 'refund-5',
      orderId: 'ord-1004',
      userId: 'user-4',
      customerName: 'Lê Hoàng Yến',
      amount: 65000,
      reason: 'Bánh mì người dùng bị đời nhưng nhà tôi chưa ăn.',
      images: [
        'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop'
      ],
      videos: [],
      items: [
        { productId: 'prod-4', productName: 'Bánh Mì Nguyên Cám Bơ Gà', quantity: 1, price: 65000 }
      ],
      bankInfo: null,
      status: 'rejected',
      refundMethod: 'bank_transfer',
      rejectReason: 'Lý do hoàn tiền không hợp lệ. Sản phẩm vẫn còn trong hạn sử dụng và được giao đúng yêu cầu.',
      createdAt: '2026-05-16T15:00:00.000Z',
      updatedAt: '2026-05-16T17:00:00.000Z'
    },
    {
      id: 'refund-6',
      orderId: 'ord-1006',
      userId: 'user-6',
      customerName: 'Hoàng Ngọc Mai',
      amount: 150000,
      reason: 'Sản phẩm không đúng như mô tả trên hình ảnh.',
      images: [],
      videos: [],
      items: [
        { productId: 'prod-3', productName: 'Nước Ép Thải Độc Cần Tây Táo', quantity: 3, price: 50000 }
      ],
      bankInfo: null,
      status: 'approved_waiting_pickup',
      refundMethod: 'cash_on_pickup',
      rejectReason: '',
      createdAt: '2026-05-21T10:00:00.000Z',
      updatedAt: '2026-05-21T11:00:00.000Z'
    }
  ])

  // --- Reviews Mock Data ---
  const reviews = ref<ReviewMock[]>([
    {
      id: 'rev-1',
      productId: 'prod-1',
      productName: 'Hộp Cơm Cá Hồi Áp Chảo',
      userId: 'user-2',
      customerName: 'Trần Thị Thu Hà',
      rating: 5,
      comment: 'Sản phẩm thơm ngon, cá hồi tươi mịn. Giao hàng nhanh. Sẽ mua lại!',
      images: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop'
      ],
      status: 'approved',
      createdAt: '2026-05-19T18:30:00.000Z',
      updatedAt: null
    },
    {
      id: 'rev-2',
      productId: 'prod-2',
      productName: 'Salad Ức Gà Sốt Mè Rang',
      userId: 'user-3',
      customerName: 'Phạm Minh Đức',
      rating: 4,
      comment: 'Salad tươi ngon nhưng phần xốt hơi ít so với giá. Tổng thể vẫn khá.',
      images: [],
      status: 'approved',
      createdAt: '2026-05-19T12:00:00.000Z',
      updatedAt: null
    },
    {
      id: 'rev-3',
      productId: 'prod-3',
      productName: 'Nước Ép Thải Độc Cần Tây Táo',
      userId: 'user-1',
      customerName: 'Nguyễn Văn Long',
      rating: 3,
      comment: 'Vị hơi đắng so với kỳ vọng nhưng mùi thơm ok. Pha loãng thêm nước thì uống được hơn.',
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&auto=format&fit=crop'
      ],
      status: 'pending',
      createdAt: '2026-05-20T07:15:00.000Z',
      updatedAt: null
    },
    {
      id: 'rev-4',
      productId: 'prod-5',
      productName: 'Cơm Đùi Gà Nướng Mật Ong',
      userId: 'user-4',
      customerName: 'Lê Hoàng Yến',
      rating: 5,
      comment: 'Tuyệt vời! Đùi gà mật ngọt thấm vào từng thớ thịt, mềm mại, thơm phức. Cơm tấm dẻo ngon. Sẽ order hàng tuần đây!',
      images: [
        'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=300&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop'
      ],
      status: 'pending',
      createdAt: '2026-05-20T09:45:00.000Z',
      updatedAt: null
    },
    {
      id: 'rev-5',
      productId: 'prod-1',
      productName: 'Hộp Cơm Cá Hồi Áp Chảo',
      userId: 'user-5',
      customerName: 'Vũ Quốc Anh',
      rating: 1,
      comment: 'Sản phẩm bị hư trước khi đến tay. Mùi hôi khủng khiếp, không thể ăn được. Chạm điểm thấp nhất.',
      images: [
        'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&auto=format&fit=crop'
      ],
      status: 'rejected',
      createdAt: '2026-05-17T20:00:00.000Z',
      updatedAt: '2026-05-18T09:00:00.000Z'
    },
    {
      id: 'rev-6',
      productId: 'prod-4',
      productName: 'Bánh Mì Nguyên Cám Bơ Gà',
      userId: 'user-2',
      customerName: 'Trần Thị Thu Hà',
      rating: 2,
      comment: 'Bánh mì bị cứng, bơ ít quá, gà lưa thơ dai. Không được như mô tả.',
      images: [],
      status: 'pending',
      createdAt: '2026-05-21T06:00:00.000Z',
      updatedAt: null
    }
  ])

  // --- Core CRUD Handlers ---

  // 1. Products
  const createProduct = (item: Omit<ProductMock, 'id'>) => {
    const id = `prod-${Date.now()}`
    const newProduct = { ...item, id, _id: id } as ProductMock
    products.value.unshift(newProduct)
    return newProduct
  }
  const updateProduct = (id: string, updates: Partial<ProductMock>) => {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      const updated = { ...products.value[idx], ...updates, updatedAt: new Date().toISOString() } as ProductMock
      products.value[idx] = updated
      return updated
    }
    return null
  }
  const deleteProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id)
  }
  const bulkDeleteProducts = (ids: string[]) => {
    products.value = products.value.filter(p => !ids.includes(p.id))
  }
  const bulkUpdateProductStatus = (ids: string[], status: 'active' | 'inactive') => {
    products.value.forEach(p => {
      if (ids.includes(p.id)) {
        p.status = status
      }
    })
  }

  // 2. Categories
  const createCategory = (item: Omit<CategoryMock, 'id'>) => {
    const id = `cat-${Date.now()}`
    const newCat = { ...item, id, _id: id } as CategoryMock
    categories.value.push(newCat)
    return newCat
  }
  const updateCategory = (id: string, updates: Partial<CategoryMock>) => {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      const updated = { ...categories.value[idx], ...updates, updatedAt: new Date().toISOString() } as CategoryMock
      categories.value[idx] = updated
      return updated
    }
    return null
  }
  const deleteCategory = (id: string) => {
    categories.value = categories.value.filter(c => c.id !== id)
  }
  const bulkDeleteCategories = (ids: string[]) => {
    categories.value = categories.value.filter(c => !ids.includes(c.id))
  }
  const bulkUpdateCategoryStatus = (ids: string[], status: 'active' | 'inactive') => {
    categories.value.forEach(c => {
      if (ids.includes(c.id)) {
        c.status = status
      }
    })
  }

  // 3. Orders
  const updateOrderStatus = (id: string, status: OrderMock['status']) => {
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = status
      if (status === 'delivered') {
        order.deliveredAt = new Date().toISOString()
      }
    }
  }
  const deleteOrder = (id: string) => {
    orders.value = orders.value.filter(o => o.id !== id)
  }
  const bulkDeleteOrders = (ids: string[]) => {
    orders.value = orders.value.filter(o => !ids.includes(o.id))
  }
  const bulkUpdateOrderStatus = (ids: string[], status: OrderMock['status']) => {
    orders.value.forEach(o => {
      if (ids.includes(o.id)) {
        o.status = status
        if (status === 'delivered') {
          o.deliveredAt = new Date().toISOString()
        }
      }
    })
  }

  // 4. Payments
  const updatePaymentStatus = (id: string, status: PaymentMock['status']) => {
    const pay = payments.value.find(p => p.id === id)
    if (pay) {
      pay.status = status
    }
  }
  const deletePayment = (id: string) => {
    payments.value = payments.value.filter(p => p.id !== id)
  }
  const bulkDeletePayments = (ids: string[]) => {
    payments.value = payments.value.filter(p => !ids.includes(p.id))
  }

  // 5. Vouchers
  const createVoucher = (item: Omit<VoucherMock, 'id'>) => {
    const id = `vouc-${Date.now()}`
    const newVoucher = { ...item, id, _id: id } as VoucherMock
    vouchers.value.push(newVoucher)
    return newVoucher
  }
  const updateVoucher = (id: string, updates: Partial<VoucherMock>) => {
    const idx = vouchers.value.findIndex(v => v.id === id)
    if (idx !== -1) {
      const updated = { ...vouchers.value[idx], ...updates } as VoucherMock
      vouchers.value[idx] = updated
      return updated
    }
    return null
  }
  const deleteVoucher = (id: string) => {
    vouchers.value = vouchers.value.filter(v => v.id !== id)
  }
  const bulkDeleteVouchers = (ids: string[]) => {
    vouchers.value = vouchers.value.filter(v => !ids.includes(v.id))
  }
  const bulkUpdateVoucherStatus = (ids: string[], status: VoucherMock['status']) => {
    vouchers.value.forEach(v => {
      if (ids.includes(v.id)) {
        v.status = status
      }
    })
  }

  // 6. Articles
  const createArticle = (item: Omit<ArticleMock, 'id'>) => {
    const id = `art-${Date.now()}`
    const newArticle = { ...item, id, _id: id } as ArticleMock
    articles.value.push(newArticle)
    return newArticle
  }
  const updateArticle = (id: string, updates: Partial<ArticleMock>) => {
    const idx = articles.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      const updated = { ...articles.value[idx], ...updates } as ArticleMock
      articles.value[idx] = updated
      return updated
    }
    return null
  }
  const deleteArticle = (id: string) => {
    articles.value = articles.value.filter(a => a.id !== id)
  }
  const bulkDeleteArticles = (ids: string[]) => {
    articles.value = articles.value.filter(a => !ids.includes(a.id))
  }
  const bulkUpdateArticleStatus = (ids: string[], status: ArticleMock['status']) => {
    articles.value.forEach(a => {
      if (ids.includes(a.id)) {
        a.status = status
      }
    })
  }

  // 7. Users
  const createUser = (item: Omit<UserMock, 'id'>) => {
    const id = `user-${Date.now()}`
    const newUser = { ...item, id, _id: id } as UserMock
    users.value.push(newUser)
    return newUser
  }
  const updateUser = (id: string, updates: Partial<UserMock>) => {
    const idx = users.value.findIndex(u => u.id === id)
    if (idx !== -1) {
      const updated = { ...users.value[idx], ...updates } as UserMock
      users.value[idx] = updated
      return updated
    }
    return null
  }
  const deleteUser = (id: string) => {
    users.value = users.value.filter(u => u.id !== id)
  }
  const bulkDeleteUsers = (ids: string[]) => {
    users.value = users.value.filter(u => !ids.includes(u.id))
  }
  const bulkUpdateUserStatus = (ids: string[], active: boolean) => {
    users.value.forEach(u => {
      if (ids.includes(u.id)) {
        u.isActive = active
      }
    })
  }

  // 8. Roles
  const createRole = (item: Omit<RoleMock, 'id'>) => {
    const id = `role-${Date.now()}`
    const newRole = { ...item, id, _id: id } as RoleMock
    roles.value.push(newRole)
    return newRole
  }
  const updateRole = (id: string, updates: Partial<RoleMock>) => {
    const idx = roles.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      const updated = { ...roles.value[idx], ...updates } as RoleMock
      roles.value[idx] = updated
      return updated
    }
    return null
  }
  const deleteRole = (id: string) => {
    roles.value = roles.value.filter(r => r.id !== id)
  }
  const bulkDeleteRoles = (ids: string[]) => {
    roles.value = roles.value.filter(r => !ids.includes(r.id))
  }

  // 9. Settings
  const updateSettings = (updates: Partial<SettingsMock>) => {
    settings.value = { ...settings.value, ...updates }
  }

  // 10. Refund Requests
  const updateRefundStatus = (id: string, status: RefundRequestMock['status'], extra?: Partial<RefundRequestMock>) => {
    const idx = refundRequests.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      const updated = {
        ...refundRequests.value[idx],
        status,
        ...extra,
        updatedAt: new Date().toISOString()
      } as RefundRequestMock
      refundRequests.value[idx] = updated
    }
  }

  // 11. Reviews
  const updateReviewStatus = (id: string, status: ReviewMock['status']) => {
    const idx = reviews.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      const updated = {
        ...reviews.value[idx],
        status,
        updatedAt: new Date().toISOString()
      } as ReviewMock
      reviews.value[idx] = updated
    }
  }

  return {
    // State
    products,
    categories,
    orders,
    payments,
    vouchers,
    articles,
    users,
    roles,
    settings,
    refundRequests,
    reviews,

    // Actions - Products
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    bulkUpdateProductStatus,

    // Actions - Categories
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    bulkUpdateCategoryStatus,

    // Actions - Orders
    updateOrderStatus,
    deleteOrder,
    bulkDeleteOrders,
    bulkUpdateOrderStatus,

    // Actions - Payments
    updatePaymentStatus,
    deletePayment,
    bulkDeletePayments,

    // Actions - Vouchers
    createVoucher,
    updateVoucher,
    deleteVoucher,
    bulkDeleteVouchers,
    bulkUpdateVoucherStatus,

    // Actions - Articles
    createArticle,
    updateArticle,
    deleteArticle,
    bulkDeleteArticles,
    bulkUpdateArticleStatus,

    // Actions - Users
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    bulkUpdateUserStatus,

    // Actions - Roles
    createRole,
    updateRole,
    deleteRole,
    bulkDeleteRoles,

    // Actions - Settings
    updateSettings,

    // Actions - Refund Requests
    updateRefundStatus,

    // Actions - Reviews
    updateReviewStatus
  }
})
