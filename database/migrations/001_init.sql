create table if not exists regions (
  id serial primary key,
  sido varchar(50) not null,
  sigungu varchar(100) not null,
  region_code varchar(30) not null unique,
  latitude double precision,
  longitude double precision,
  constraint uq_region_name unique (sido, sigungu)
);

create table if not exists users (
  id serial primary key,
  email varchar(255) not null unique,
  password_hash varchar(255) not null,
  nickname varchar(100) not null,
  preferred_region_id integer references regions(id),
  budget_min integer,
  budget_max integer,
  expected_guest_count integer,
  role varchar(20) not null default 'user',
  created_at timestamp without time zone not null default now()
);

create table if not exists admin_users (
  id serial primary key,
  email varchar(255) not null unique,
  password_hash varchar(255) not null,
  name varchar(100) not null,
  role_name varchar(100) not null default 'super_admin',
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now()
);

create table if not exists venues (
  id serial primary key,
  region_id integer not null references regions(id),
  name varchar(255) not null,
  slug varchar(255) not null unique,
  address varchar(255) not null,
  road_address varchar(255),
  latitude double precision,
  longitude double precision,
  phone varchar(50),
  homepage_url varchar(255),
  description text,
  hall_type varchar(100),
  mood_tags jsonb,
  warranty_guest_min integer,
  warranty_guest_max integer,
  meal_price_min integer,
  meal_price_max integer,
  rental_fee_min integer,
  rental_fee_max integer,
  is_public_hall boolean not null default false,
  is_single_hall boolean not null default false,
  is_simultaneous_ceremony boolean not null default false,
  can_outdoor boolean not null default false,
  is_active boolean not null default true,
  trust_grade varchar(1) not null default 'B',
  data_confidence_note varchar(255),
  review_count integer not null default 0,
  review_rating double precision not null default 0,
  overall_score double precision not null default 0,
  last_verified_at timestamp without time zone,
  source_type varchar(50) not null default 'manual'
);

create index if not exists ix_venues_region_score on venues(region_id, overall_score);
create index if not exists ix_venues_public_active on venues(is_public_hall, is_active);
create index if not exists ix_venues_name on venues(name);

create table if not exists venue_halls (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  name varchar(100) not null,
  floor varchar(50),
  hall_type varchar(100),
  capacity_min integer,
  capacity_max integer,
  description text
);

create table if not exists venue_pricings (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  item_name varchar(100) not null,
  price_min integer not null,
  price_max integer not null,
  unit varchar(50) not null default '원',
  notes varchar(255)
);

create table if not exists venue_meals (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  meal_type varchar(100) not null,
  price_per_person integer not null,
  is_buffet boolean not null default true,
  has_noodle_station boolean not null default false,
  notes varchar(255)
);

create table if not exists venue_parkings (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  parking_slots integer not null,
  free_minutes integer,
  valet_available boolean not null default false,
  notes varchar(255)
);

create table if not exists venue_access (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  subway_line varchar(100),
  subway_minutes integer,
  bus_stop_name varchar(100),
  bus_minutes integer,
  shuttle_available boolean not null default false
);

create table if not exists venue_policies (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  policy_type varchar(100) not null,
  content text not null,
  flexibility_score integer
);

create table if not exists venue_photos (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  image_url varchar(255) not null,
  category varchar(50) not null default 'hall',
  sort_order integer not null default 0
);

create table if not exists reviews (
  id serial primary key,
  venue_id integer not null references venues(id) on delete cascade,
  user_id integer references users(id),
  review_type varchar(20) not null,
  title varchar(150) not null,
  content text not null,
  rating_overall double precision not null,
  rating_food double precision not null,
  rating_access double precision not null,
  rating_parking double precision not null,
  rating_mood double precision not null,
  rating_contract double precision not null,
  is_verified boolean not null default false,
  status varchar(20) not null default 'pending',
  created_at timestamp without time zone not null default now()
);

create table if not exists review_photos (
  id serial primary key,
  review_id integer not null references reviews(id) on delete cascade,
  image_url varchar(255) not null
);

create table if not exists bookmarks (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,
  venue_id integer not null references venues(id) on delete cascade,
  created_at timestamp without time zone not null default now(),
  constraint uq_bookmark unique (user_id, venue_id)
);

create table if not exists comparison_sets (
  id serial primary key,
  user_id integer not null references users(id) on delete cascade,
  title varchar(150) not null default '기본 비교함',
  created_at timestamp without time zone not null default now()
);

create table if not exists comparison_set_items (
  id serial primary key,
  comparison_set_id integer not null references comparison_sets(id) on delete cascade,
  venue_id integer not null references venues(id) on delete cascade,
  constraint uq_comparison_item unique (comparison_set_id, venue_id)
);

create table if not exists inquiries (
  id serial primary key,
  user_id integer references users(id),
  venue_id integer references venues(id),
  name varchar(100) not null,
  phone varchar(50) not null,
  email varchar(255),
  message text not null,
  preferred_contact_time varchar(100),
  status varchar(20) not null default 'received',
  created_at timestamp without time zone not null default now()
);

create table if not exists data_ingestion_logs (
  id serial primary key,
  source_name varchar(150) not null,
  status varchar(20) not null,
  total_count integer not null default 0,
  success_count integer not null default 0,
  failure_count integer not null default 0,
  notes text,
  payload jsonb,
  started_at timestamp without time zone not null default now(),
  finished_at timestamp without time zone
);

create table if not exists audit_logs (
  id serial primary key,
  actor_type varchar(50) not null,
  actor_id integer,
  action varchar(100) not null,
  target_type varchar(100) not null,
  target_id integer,
  metadata_json jsonb,
  created_at timestamp without time zone not null default now()
);
