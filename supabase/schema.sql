-- ============================================================
-- مصحة روح — قاعدة البيانات (Supabase / PostgreSQL)
-- شغّل هذا الملف كاملًا في: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ------------------------------------------------------------
-- 1) الأدوار الوظيفية (Employee roles)
-- ------------------------------------------------------------
-- super_admin : تحكم كامل — يدير الموظفين والصلاحيات، ويرى كل شيء
-- admin       : يدير محتوى الموقع (الأطباء، الخدمات، الأوقات) لكن لا يدير الموظفين
-- doctor      : حساب طبيب — يرى/يعدّل جدوله الخاص فقط (اختياري لاستخدام مستقبلي)
-- staff       : موظف استقبال — صلاحية عرض فقط (اختياري لاستخدام مستقبلي)
create type public.employee_role as enum (
  'super_admin',
  'admin',
  'doctor',
  'staff'
);

-- المسميات الوظيفية المعروضة في الموقع (منفصلة عن الدور البرمجي أعلاه)
-- هذا الجدول اختياري: يسمح لك بإضافة مسميات جديدة من لوحة التحكم
-- بدل تعديل الكود في كل مرة.
create table public.job_titles (
  id bigint generated always as identity primary key,
  title_ar text not null unique
);

insert into public.job_titles (title_ar) values
  ('طبيب نفسي'),
  ('طبيبة نفسية'),
  ('طبيب نفسي وعلاج إدمان'),
  ('استشاري الطب النفسي وعلاج الإدمان'),
  ('استشاري العلاج النفسي وعلاج الإدمان'),
  ('استشارية الطب النفسي'),
  ('استشاري الطب النفسي للأطفال والمراهقين'),
  ('أخصائي علاج نفسي'),
  ('أخصائية علاج نفسي'),
  ('أخصائية الطب النفسي'),
  ('أخصائية العلاج النفسي المعرفي السلوكي'),
  ('موظف استقبال'),
  ('مدير العيادة');

-- ------------------------------------------------------------
-- 2) ملفات الموظفين (يرتبط كل صف بحساب Supabase Auth)
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role public.employee_role not null default 'staff',
  job_title text, -- مسمى العرض، مثال: "مدير العيادة" أو أحد job_titles
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- إنشاء صف profile تلقائيًا عند تسجيل مستخدم جديد في Supabase Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'staff' -- الدور الافتراضي؛ super_admin يرفعه لاحقًا من لوحة التحكم
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 3) الأطباء
-- ------------------------------------------------------------
create table public.doctors (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles (id) on delete set null, -- اختياري: ربط بحساب دخول
  name text not null,
  title text not null,       -- المسمى المعروض، مثال: "أخصائية علاج نفسي"
  specialty text not null,
  initials text not null,
  image_url text,            -- رابط الصورة (Supabase Storage أو أي رابط)
  bio text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 4) جداول مواعيد الأطباء
-- ------------------------------------------------------------
create table public.doctor_schedule (
  id bigint generated always as identity primary key,
  doctor_id bigint not null references public.doctors (id) on delete cascade,
  day_of_week text,          -- مثال: "السبت" — اتركه فارغًا إذا كان "note" معبّأ
  start_time text,           -- نص حر مثل "9:00 م" لتفادي تعقيد المناطق الزمنية
  end_time text,
  note text,                 -- لحالات خاصة مثل "الحجز المسبق أونلاين"
  sort_order int not null default 0
);

-- ------------------------------------------------------------
-- 5) الخدمات ولماذا نحن (محتوى قابل للتعديل من اللوحة)
-- ------------------------------------------------------------
create table public.services (
  id bigint generated always as identity primary key,
  icon text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

create table public.why_us (
  id bigint generated always as identity primary key,
  icon text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0
);

-- ------------------------------------------------------------
-- 6) أوقات العمل الأسبوعية
-- ------------------------------------------------------------
create table public.working_hours (
  id bigint generated always as identity primary key,
  day_of_week text not null unique,
  hours_text text not null,   -- مثال: "9:00 ص – 9:00 م"
  is_open boolean not null default true,
  sort_order int not null default 0
);

-- ------------------------------------------------------------
-- 7) إعدادات العيادة (صف واحد فقط)
-- ------------------------------------------------------------
create table public.clinic_settings (
  id int primary key default 1,
  name text not null,
  short_name text not null,
  tagline text,
  description text,
  phone text,
  email text,
  address text,
  google_maps_url text,
  google_maps_embed_url text,
  instagram_url text,
  whatsapp_url text,
  twitter_url text,
  facebook_url text,
  tiktok_url text,
  snapchat_url text,
  constraint single_row check (id = 1)
);

insert into public.clinic_settings (id, name, short_name)
values (1, 'مصحة روح للطب النفسي', 'مصحة روح');

-- ------------------------------------------------------------
-- 8) (اختياري) طلبات حجز واردة من الموقع
-- ------------------------------------------------------------
create table public.appointment_requests (
  id bigint generated always as identity primary key,
  doctor_id bigint references public.doctors (id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  preferred_day text,
  notes text,
  status text not null default 'new', -- new | contacted | booked | cancelled
  created_at timestamptz not null default now()
);

-- ============================================================
-- دوال مساعدة لفحص الدور الحالي (تُستخدم داخل سياسات RLS)
-- ============================================================
create function public.current_role()
returns public.employee_role
language sql stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_super_admin()
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select public.current_role() = 'super_admin';
$$;

create function public.is_admin_or_above()
returns boolean
language sql stable
security definer
set search_path = public
as $$
  select public.current_role() in ('super_admin', 'admin');
$$;

-- ============================================================
-- تفعيل Row Level Security على كل الجداول
-- ============================================================
alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_schedule enable row level security;
alter table public.services enable row level security;
alter table public.why_us enable row level security;
alter table public.working_hours enable row level security;
alter table public.clinic_settings enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.job_titles enable row level security;

-- ------------------------------------------------------------
-- سياسات: القراءة العامة (يحتاجها موقع العيادة العام لعرض
-- الأطباء والخدمات والأوقات بدون تسجيل دخول)
-- ------------------------------------------------------------
create policy "public can read active doctors"
  on public.doctors for select
  using (is_active = true);

create policy "public can read schedule"
  on public.doctor_schedule for select
  using (true);

create policy "public can read services"
  on public.services for select using (true);

create policy "public can read why_us"
  on public.why_us for select using (true);

create policy "public can read working_hours"
  on public.working_hours for select using (true);

create policy "public can read clinic_settings"
  on public.clinic_settings for select using (true);

create policy "public can submit appointment requests"
  on public.appointment_requests for insert
  with check (true);

-- ------------------------------------------------------------
-- سياسات: لوحة التحكم (admin وما فوق يديرون المحتوى)
-- ------------------------------------------------------------
create policy "admins manage doctors"
  on public.doctors for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

create policy "admins manage schedule"
  on public.doctor_schedule for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

create policy "admins manage services"
  on public.services for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

create policy "admins manage why_us"
  on public.why_us for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

create policy "admins manage working_hours"
  on public.working_hours for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

create policy "admins manage clinic_settings"
  on public.clinic_settings for update
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

create policy "admins manage job_titles"
  on public.job_titles for all
  using (public.is_admin_or_above())
  with check (public.is_admin_or_above());

create policy "admins view appointment requests"
  on public.appointment_requests for select
  using (public.is_admin_or_above());

create policy "admins update appointment requests"
  on public.appointment_requests for update
  using (public.is_admin_or_above());

-- ------------------------------------------------------------
-- سياسات: ملفات الموظفين (profiles)
-- - أي موظف يرى ملفه الشخصي فقط
-- - super_admin فقط يرى/يضيف/يعدّل/يحذف كل الموظفين
-- ------------------------------------------------------------
create policy "user reads own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "super_admin reads all profiles"
  on public.profiles for select
  using (public.is_super_admin());

create policy "super_admin manages profiles"
  on public.profiles for update
  using (public.is_super_admin())
  with check (public.is_super_admin());

create policy "super_admin deletes profiles"
  on public.profiles for delete
  using (public.is_super_admin());

-- ============================================================
-- ملاحظة مهمة بعد تشغيل هذا الملف:
-- ============================================================
-- 1) أنشئ أول حساب super_admin يدويًا:
--    Supabase Dashboard → Authentication → Add user (بريد وكلمة مرور)
--    ثم في SQL Editor نفّذ:
--    update public.profiles set role = 'super_admin', full_name = 'اسمك'
--    where email = 'ضع_بريدك_هنا@example.com';
--
-- 2) بعدها سجّل الدخول من لوحة التحكم داخل الموقع (/admin)
--    وأضف بقية الموظفين من هناك.
-- ============================================================
