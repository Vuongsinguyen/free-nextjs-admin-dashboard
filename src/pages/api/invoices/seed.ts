import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const invoicesData = [
      { invoice_number: 'INV-2025-001', apartment: 'A101', resident_name: 'Nguyễn Văn A', amount: 5000000, status: 'paid', due_date: '2025-01-15', notes: 'Đã thanh toán đầy đủ', water_fee: 800000, management_fee: 3000000, urban_management_fee: 500000, parking_fee: 400000, late_payment_penalty: 0, other_fees: 300000, area: 85 },
      { invoice_number: 'INV-2025-002', apartment: 'A102', resident_name: 'Trần Thị B', amount: 4500000, status: 'unpaid', due_date: '2025-02-15', notes: '', water_fee: 750000, management_fee: 2800000, urban_management_fee: 450000, parking_fee: 350000, late_payment_penalty: 0, other_fees: 150000, area: 78 },
      { invoice_number: 'INV-2025-003', apartment: 'A103', resident_name: 'Lê Văn C', amount: 6000000, status: 'overdue', due_date: '2024-12-15', notes: 'Quá hạn thanh toán', water_fee: 950000, management_fee: 3500000, urban_management_fee: 600000, parking_fee: 500000, late_payment_penalty: 450000, other_fees: 0, area: 92 },
      { invoice_number: 'INV-2025-004', apartment: 'B201', resident_name: 'Phạm Thị D', amount: 5500000, status: 'paid', due_date: '2025-01-20', notes: '', water_fee: 850000, management_fee: 3200000, urban_management_fee: 550000, parking_fee: 450000, late_payment_penalty: 0, other_fees: 250000, area: 88 },
      { invoice_number: 'INV-2025-005', apartment: 'B202', resident_name: 'Hoàng Văn E', amount: 4800000, status: 'unpaid', due_date: '2025-02-20', notes: '', water_fee: 700000, management_fee: 2600000, urban_management_fee: 480000, parking_fee: 380000, late_payment_penalty: 0, other_fees: 200000, area: 75 },
      { invoice_number: 'INV-2025-006', apartment: 'B203', resident_name: 'Vũ Thị F', amount: 5200000, status: 'paid', due_date: '2025-01-25', notes: 'Đã chuyển khoản', water_fee: 780000, management_fee: 2900000, urban_management_fee: 520000, parking_fee: 420000, late_payment_penalty: 0, other_fees: 0, area: 82 },
      { invoice_number: 'INV-2025-007', apartment: 'C301', resident_name: 'Đặng Văn G', amount: 7000000, status: 'overdue', due_date: '2024-11-30', notes: 'Cần liên hệ khẩn', water_fee: 1100000, management_fee: 4000000, urban_management_fee: 700000, parking_fee: 600000, late_payment_penalty: 600000, other_fees: 0, area: 105 },
      { invoice_number: 'INV-2025-008', apartment: 'C302', resident_name: 'Bùi Thị H', amount: 4700000, status: 'paid', due_date: '2025-01-10', notes: '', water_fee: 680000, management_fee: 2500000, urban_management_fee: 470000, parking_fee: 370000, late_payment_penalty: 0, other_fees: 200000, area: 72 },
      { invoice_number: 'INV-2025-009', apartment: 'C303', resident_name: 'Đinh Văn I', amount: 5300000, status: 'unpaid', due_date: '2025-02-10', notes: '', water_fee: 790000, management_fee: 2950000, urban_management_fee: 530000, parking_fee: 430000, late_payment_penalty: 0, other_fees: 0, area: 84 },
      { invoice_number: 'INV-2025-010', apartment: 'D401', resident_name: 'Ngô Thị K', amount: 6500000, status: 'paid', due_date: '2025-01-05', notes: 'Thanh toán tiền mặt', water_fee: 1000000, management_fee: 3700000, urban_management_fee: 650000, parking_fee: 550000, late_payment_penalty: 0, other_fees: 0, area: 98 },
      { invoice_number: 'INV-2025-011', apartment: 'D402', resident_name: 'Dương Văn L', amount: 4900000, status: 'unpaid', due_date: '2025-02-05', notes: '', water_fee: 720000, management_fee: 2700000, urban_management_fee: 490000, parking_fee: 390000, late_payment_penalty: 0, other_fees: 200000, area: 76 },
      { invoice_number: 'INV-2025-012', apartment: 'D403', resident_name: 'Lý Thị M', amount: 5400000, status: 'overdue', due_date: '2024-12-20', notes: 'Đã nhắc nhở', water_fee: 820000, management_fee: 3050000, urban_management_fee: 540000, parking_fee: 440000, late_payment_penalty: 400000, other_fees: 0, area: 86 },
      { invoice_number: 'INV-2025-013', apartment: 'E501', resident_name: 'Võ Văn N', amount: 5100000, status: 'paid', due_date: '2025-01-18', notes: '', water_fee: 760000, management_fee: 2850000, urban_management_fee: 510000, parking_fee: 410000, late_payment_penalty: 0, other_fees: 200000, area: 80 },
      { invoice_number: 'INV-2025-014', apartment: 'E502', resident_name: 'Trương Thị O', amount: 4600000, status: 'unpaid', due_date: '2025-02-18', notes: '', water_fee: 670000, management_fee: 2500000, urban_management_fee: 460000, parking_fee: 360000, late_payment_penalty: 0, other_fees: 200000, area: 71 },
      { invoice_number: 'INV-2025-015', apartment: 'E503', resident_name: 'Phan Văn P', amount: 5800000, status: 'paid', due_date: '2025-01-22', notes: 'Đã thanh toán online', water_fee: 880000, management_fee: 3300000, urban_management_fee: 580000, parking_fee: 480000, late_payment_penalty: 0, other_fees: 200000, area: 90 },
      { invoice_number: 'INV-2025-016', apartment: 'F601', resident_name: 'Mai Thị Q', amount: 6200000, status: 'overdue', due_date: '2024-12-10', notes: 'Chưa liên hệ được', water_fee: 950000, management_fee: 3550000, urban_management_fee: 620000, parking_fee: 520000, late_payment_penalty: 530000, other_fees: 0, area: 95 },
      { invoice_number: 'INV-2025-017', apartment: 'F602', resident_name: 'Hồ Văn R', amount: 4750000, status: 'paid', due_date: '2025-01-12', notes: '', water_fee: 690000, management_fee: 2580000, urban_management_fee: 475000, parking_fee: 375000, late_payment_penalty: 0, other_fees: 200000, area: 73 },
      { invoice_number: 'INV-2025-018', apartment: 'F603', resident_name: 'Tô Thị S', amount: 5250000, status: 'unpaid', due_date: '2025-02-12', notes: '', water_fee: 780000, management_fee: 2920000, urban_management_fee: 525000, parking_fee: 425000, late_payment_penalty: 0, other_fees: 200000, area: 83 },
      { invoice_number: 'INV-2025-019', apartment: 'G701', resident_name: 'La Văn T', amount: 5600000, status: 'paid', due_date: '2025-01-28', notes: 'Đã xác nhận', water_fee: 840000, management_fee: 3150000, urban_management_fee: 560000, parking_fee: 460000, late_payment_penalty: 0, other_fees: 200000, area: 89 },
      { invoice_number: 'INV-2025-020', apartment: 'G702', resident_name: 'Từ Thị U', amount: 4850000, status: 'unpaid', due_date: '2025-02-28', notes: '', water_fee: 710000, management_fee: 2660000, urban_management_fee: 485000, parking_fee: 385000, late_payment_penalty: 0, other_fees: 200000, area: 74 },
      { invoice_number: 'INV-2025-021', apartment: 'G703', resident_name: 'Ông Văn V', amount: 5350000, status: 'overdue', due_date: '2024-12-05', notes: 'Đã gửi email nhắc nhở', water_fee: 800000, management_fee: 3000000, urban_management_fee: 535000, parking_fee: 435000, late_payment_penalty: 430000, other_fees: 0, area: 87 },
      { invoice_number: 'INV-2025-022', apartment: 'H801', resident_name: 'Bà Thị W', amount: 6800000, status: 'paid', due_date: '2025-01-08', notes: '', water_fee: 1050000, management_fee: 3900000, urban_management_fee: 680000, parking_fee: 580000, late_payment_penalty: 0, other_fees: 200000, area: 102 },
      { invoice_number: 'INV-2025-023', apartment: 'H802', resident_name: 'Cô Văn X', amount: 4950000, status: 'unpaid', due_date: '2025-02-08', notes: '', water_fee: 730000, management_fee: 2740000, urban_management_fee: 495000, parking_fee: 395000, late_payment_penalty: 0, other_fees: 200000, area: 77 },
      { invoice_number: 'INV-2025-024', apartment: 'H803', resident_name: 'Chú Thị Y', amount: 5450000, status: 'paid', due_date: '2025-01-16', notes: 'Đã thanh toán qua app', water_fee: 820000, management_fee: 3070000, urban_management_fee: 545000, parking_fee: 445000, late_payment_penalty: 0, other_fees: 200000, area: 85 },
      { invoice_number: 'INV-2025-025', apartment: 'I901', resident_name: 'Anh Văn Z', amount: 5700000, status: 'overdue', due_date: '2024-11-25', notes: 'Cần gọi điện thoại', water_fee: 860000, management_fee: 3220000, urban_management_fee: 570000, parking_fee: 470000, late_payment_penalty: 490000, other_fees: 0, area: 91 },
      { invoice_number: 'INV-2025-026', apartment: 'I902', resident_name: 'Chị Thị AA', amount: 4800000, status: 'paid', due_date: '2025-01-14', notes: '', water_fee: 700000, management_fee: 2630000, urban_management_fee: 480000, parking_fee: 380000, late_payment_penalty: 0, other_fees: 200000, area: 74 },
      { invoice_number: 'INV-2025-027', apartment: 'I903', resident_name: 'Em Văn BB', amount: 5150000, status: 'unpaid', due_date: '2025-02-14', notes: '', water_fee: 760000, management_fee: 2850000, urban_management_fee: 515000, parking_fee: 415000, late_payment_penalty: 0, other_fees: 200000, area: 81 },
      { invoice_number: 'INV-2025-028', apartment: 'J1001', resident_name: 'Cậu Thị CC', amount: 6300000, status: 'paid', due_date: '2025-01-11', notes: 'Đã nhận biên lai', water_fee: 960000, management_fee: 3600000, urban_management_fee: 630000, parking_fee: 530000, late_payment_penalty: 0, other_fees: 200000, area: 96 },
      { invoice_number: 'INV-2025-029', apartment: 'J1002', resident_name: 'Dì Văn DD', amount: 4900000, status: 'unpaid', due_date: '2025-02-11', notes: '', water_fee: 720000, management_fee: 2700000, urban_management_fee: 490000, parking_fee: 390000, late_payment_penalty: 0, other_fees: 200000, area: 76 },
      { invoice_number: 'INV-2025-030', apartment: 'J1003', resident_name: 'Bác Thị EE', amount: 5500000, status: 'overdue', due_date: '2024-12-01', notes: 'Đã gửi thư nhắc nhở', water_fee: 830000, management_fee: 3110000, urban_management_fee: 550000, parking_fee: 450000, late_payment_penalty: 460000, other_fees: 0, area: 88 }
    ];

    const { data, error } = await supabase
      .from('invoices')
      .insert(invoicesData)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ 
      message: 'Invoices seeded successfully',
      count: data.length,
      data 
    });
  } catch (error) {
    console.error('Error seeding invoices:', error);
    return res.status(500).json({ error: 'Failed to seed invoices' });
  }
}
