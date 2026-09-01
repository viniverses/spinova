import { inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@package/env/server";
import { Pool } from "pg";

import {
  addresses,
  albums,
  artists,
  categories,
  featuredItems,
  featuredSections,
  inventoryMovements,
  orderItems,
  orders,
  productCategories,
  productImages,
  productTags,
  products,
  reviews,
  user,
  type NewAddress,
  type NewAlbum,
  type NewArtist,
  type NewCategory,
  type NewFeaturedItem,
  type NewFeaturedSection,
  type NewInventoryMovement,
  type NewOrderItem,
  type NewOrder,
  type NewProductImage,
  type NewProduct,
  type NewReview,
} from "./schema/index.ts";

const R2_PUBLIC_URL = "https://pub-969b1067451d4a77939bf7e9852ee1eb.r2.dev";

// --- UUIDs fixos para idempotência do seed ---

const ARTIST = {
  sza: "bd3c4eae-7c3f-4ade-aff3-2621030b7849",
  the_xx: "c3f38f81-ca15-4df7-bc2e-ffb28d6da081",
  bjork: "460ed871-c5eb-434b-b8e1-1e964365ea34",
  caroline_polachek: "c3216cdc-f410-4441-ab13-59734ea07e73",
  yves_tumor: "733963bf-d4db-4900-8289-4127eebf1204",
  fka_twigs: "e052b7b3-232e-4904-8c43-0263e0a3a6d0",
  kali_uchis: "0c7d9188-7af6-4438-8412-a6b1cce263f2",
  kelela: "1fd8d6d9-50f4-4ae2-9df5-a9814f02c1ee",
  anri: "87b898ac-c1de-4bf6-97f2-b40f96fe9db5",
  bad_bunny: "e5045804-451b-4fa7-953d-81bc6d6b5f59",
  lana_del_rey: "172c9def-8771-4b22-9ca4-56bcf206774b",
  nine_inch_nails_boys_noize: "d1c08906-27cf-4c07-ab4b-be4ef1e444fc",
  rosalia: "071aab16-848f-4052-8643-5ca809e162f9",
  slayyyter: "7d12a976-2e45-47bc-b0cd-b48c066c5519",
  steve_lacy: "f85370bd-799a-4cdd-b7be-ea336a85eef6",
  tyler_the_creator: "7c2d5973-ff38-4c5f-ba9f-f272c8820f84",
  weyes_blood: "387ca7c0-c2cc-46bc-b5c3-ce62fed1ada7",
} as const;

const ALBUM = {
  sos: "61db206f-265f-4b66-a06e-59913956f54f",
  i_see_you: "2ab3a058-0616-4d00-a45e-c916984a374f",
  fossora: "8a2293e4-4dc6-4761-bed8-770e8b8c00f7",
  desire_i_want_to_turn_into_you: "bd8e6b1a-2e85-40d3-8cf3-44a1c5ba6af1",
  praise_a_lord: "f3ededdb-0c6c-4c58-9412-60f8f5eed58b",
  lp1: "0b2b076a-a658-4b8e-a81f-04239f2a73f2",
  red_moon_in_venus: "2d92b097-ddbd-45e5-ba33-9717c7975c36",
  raven: "7f1ec308-4582-4f00-8dd8-9eebf099d3b9",
  timely: "bc8ad7b3-8cd2-4b7d-a400-2e8a8130765a",
  un_verano_sin_ti: "121f9149-5026-4b07-a1c4-c38b8c13938d",
  caprisongs: "bbec5f1e-ea2a-4fcf-bb0e-8ce4995329fe",
  did_you_know_ocean_blvd: "14676d9c-a5f0-432e-9d9f-70600cb2344f",
  nine_inch_noize: "ab1b6c7f-1595-42ea-9108-030639213ddd",
  motomami: "03611377-410f-4571-a1b7-2c6ec16e47ff",
  worst_girl_in_america: "90395d93-8d77-42b0-98c9-ba4afa11e13f",
  gemini_rights: "6626e4b0-d406-4ebf-aeb5-4823125dad15",
  flower_boy: "8c617660-9bab-4016-bac8-1a0497d28828",
  and_in_the_darkness_hearts_aglow: "e33b7929-3e9a-426d-8888-d60f18e7f930",
} as const;

const PRODUCT = {
  w1: "19bc01d9-532b-4b9e-8457-9e064640ef5e",
  w2: "c9776eba-d1a4-498b-9efd-67b749155f43",
  w3: "ede2556f-8ef9-44d9-b685-34063ced513f",
  w5: "895f32e7-9ed2-4265-82aa-0fc826cd0267",
  w6: "f802b335-9efa-41e5-b9ab-7377580abc47",
  vinyl_lp1: "11f405ab-7dd5-4479-aa3c-39e45093b65c",
  vinyl_red_moon_in_venus: "154af58e-dfa8-402e-a9ac-f1224a6bb56d",
  vinyl_raven: "5302900e-c863-4efe-8c3d-597981e69d84",
  vinyl_timely: "b8548a8a-35e6-4745-9999-bd55d56161a8",
  vinyl_un_verano_sin_ti: "04278521-a840-4481-84b1-dab697ccef07",
  vinyl_caprisongs: "ec8f461d-246d-4e48-852a-002ccf1c103c",
  vinyl_did_you_know_ocean_blvd: "2bdba497-0eab-4de2-a2be-51e2a7c66813",
  vinyl_nine_inch_noize: "371bd11d-2a41-4eae-8c58-182de54bbc73",
  vinyl_motomami: "9bb11d28-fbc3-4a57-9f2d-65b438e66c3e",
  vinyl_worst_girl_in_america: "c62ca9e4-f915-4c33-b666-d9e5d187cdfc",
  vinyl_gemini_rights: "00f0b9cd-4e55-4f32-a60e-496fc0f93809",
  vinyl_flower_boy: "a2e7f539-d556-463d-959f-649489ff4f32",
  vinyl_and_in_the_darkness_hearts_aglow:
    "95f9b16a-45be-4b83-adcd-3f23fb74e625",
} as const;

const CATEGORY = {
  electronic: "f39f19c4-8a3f-4293-bae6-0bb2e1fe9f3c",
  indie_pop: "4d8aacae-f59a-4561-84a4-badee99376c2",
  art_rock: "8f8da217-ca98-4aaf-adfa-3cfc5bc9aa0b",
  experimental: "741534fb-7d46-4323-af19-d5cb47a8b0f0",
  staff_picks: "f5baf670-8e89-4c92-aa42-4591dcaedc75",
  city_pop: "f426af2d-da91-41ea-82ba-ea2987b38695",
  reggaeton: "79249ba9-24ac-411b-808d-acc61fe6a705",
  alternative_rnb: "d730bfd4-4508-4bcd-acfb-3167fb1509f2",
  alternative_pop: "b6193753-e06f-45b9-9ab3-09c77f92278f",
  industrial_electronic: "6897dada-c8a7-4018-9544-9dabfe162559",
  experimental_pop: "345f47e5-3d92-417c-a85d-8564f1bb3b3b",
  electroclash: "a09aa70b-d556-4997-b972-568fca79738c",
  rnb: "77bbe0d7-d103-424c-97cb-19818fc2db13",
  hip_hop: "fdda6405-6432-475c-8158-69cecc6f8809",
  chamber_pop: "bd1a4c56-0c15-44e4-9b81-a2614017bca5",
} as const;

const IMAGE = {
  w1: "52a118c1-7819-4477-9aab-f00626908be9",
  w2: "ff44cd95-133f-4a34-b4da-ddc2fb8d7ce3",
  w3: "b16e3c33-4afe-4719-9b62-474efbfee5cd",
  w5: "c5d8e274-ef3e-4eec-af19-072fb16de209",
  w6: "b15887bc-93ac-4920-b898-2fd60e71e63f",
  vinyl_lp1: "84d91563-0b9b-4671-9c38-8968ec9f1838",
  vinyl_red_moon_in_venus: "c3ca2893-c519-4e83-950e-496e0e5778c5",
  vinyl_raven: "45f49455-5508-451f-882b-707232be98db",
  vinyl_timely: "661fa652-43b9-4a63-b59c-219f2226fdc0",
  vinyl_un_verano_sin_ti: "97c26462-9089-4016-b876-cd0b6b3abdd4",
  vinyl_caprisongs: "f2c6badc-d2ca-4153-a46c-f46313be9b20",
  vinyl_did_you_know_ocean_blvd: "3dddbd9b-18a9-4827-a9c1-5a7b1ee1ae67",
  vinyl_nine_inch_noize: "0f0728ec-ffc4-43a8-a2c7-3df0d720153c",
  vinyl_motomami: "d056666e-8c70-45f4-8200-6700442dc511",
  vinyl_worst_girl_in_america: "562ba535-7b78-4a62-b5cc-e44b20e8d1c0",
  vinyl_gemini_rights: "b2e9c905-e663-49b8-a704-047da3d3980a",
  vinyl_flower_boy: "c41ca644-1ac3-4474-af9b-7959703bad4d",
  vinyl_and_in_the_darkness_hearts_aglow:
    "379fc387-36ec-4be5-834f-94f233707df4",
} as const;

const INVENTORY = {
  initial_w1: "2db0b8bc-c7b0-4f7d-a3c3-8e553dfd200a",
  sales_w1: "cb52f714-d032-4058-be2c-20b47106d928",
  initial_w2: "59294c65-b35d-4370-a7e1-9dfd6a6eff92",
  sales_w2: "f1f9b6df-7f0b-458f-b6f4-63cadc07b176",
  initial_w3: "5f8a4fb2-806b-4159-8860-03deaf29b850",
  sales_w3: "46871498-12b7-42ab-863c-afae51da6861",
  initial_w5: "91c778f0-2a66-44b5-9908-f4b7d16daf0a",
  sales_w5: "9a101cff-2e56-4f2c-8749-a538bb487736",
  initial_vinyl_lp1: "acd573c3-36ea-4e43-8f2f-e1a24e250898",
  initial_vinyl_red_moon_in_venus: "2f204add-d721-4ba5-8b73-dc580a64550b",
  initial_vinyl_raven: "9826cced-3c15-47e7-9cd7-082b3b2c1457",
  initial_vinyl_timely: "89b656b2-9322-42c7-9688-5f5ca81e0e28",
  initial_vinyl_un_verano_sin_ti: "ac590d2b-09fe-487f-ad68-c61db4b22c77",
  initial_vinyl_caprisongs: "98a55040-e37c-4bc0-959a-fc75636d3748",
  initial_vinyl_did_you_know_ocean_blvd: "83d64771-aabf-4aed-ae13-55ef1f6a5d44",
  initial_vinyl_nine_inch_noize: "48dd4a6c-9ed0-473e-b1b2-c4631f258971",
  initial_vinyl_motomami: "559b8c2b-653e-48f5-b7ff-95be3f70b96e",
  initial_vinyl_worst_girl_in_america: "e367c7cc-9664-4610-98a0-9d76171f94f6",
  initial_vinyl_gemini_rights: "9bd84a0c-fa7c-48b3-8e23-a57f42ec1346",
  initial_vinyl_flower_boy: "e535960f-4cf9-4e3a-aac3-9702b420ae98",
  initial_vinyl_and_in_the_darkness_hearts_aglow:
    "9c934dca-be5e-495e-8cc6-00b2a6c6f178",
} as const;

const SECTION = {
  home_releases: "b0d71e1b-7d6f-450b-ba82-2912fbee0263",
  home_recommendations: "44430e26-4b40-4955-822f-6a892f542f5c",
} as const;

const FEAT_ITEM = {
  releases_vinyl_nine_inch_noize: "e373cbde-a8aa-4fa7-823b-626b9ae43985",
  releases_vinyl_worst_girl_in_america: "38ea0d02-e037-4538-becd-18b278c61078",
  releases_w1: "1e7096b4-2a03-4f81-bd2b-51d09eeeb41f",
  releases_w2: "ddcbaba1-45d0-4167-83a2-13e05e376e96",
  releases_w3: "fd5baf36-3f8b-4b4b-8606-1db80075930d",
  recs_vinyl_timely: "84f8207d-d769-4696-8abf-03ed87a4fd3c",
  recs_vinyl_motomami: "080e617c-0a7c-4b4c-b38f-d862c1502e9e",
  recs_vinyl_flower_boy: "a5a23466-b91a-4bbc-a6b1-842400ccc527",
  recs_vinyl_hearts_aglow: "21e765f1-fda4-4c42-a7ff-2bd053f52387",
  recs_w2: "8dd1b948-a167-45d9-9945-d7deb21d0628",
  recs_w3: "e01bccee-00a9-4ac9-b6e0-bb8e3d90d5ce",
  recs_w5: "2d4fe3b0-1d03-43ae-ae8f-a29be3dba4d0",
  recs_w6: "697278d9-73bd-476f-8dcd-6c45401caef8",
} as const;

const ORDER = {
  seed_delivered: "223212ad-51c7-483c-9a78-c53e4289be7d",
} as const;

const ORDER_ITEM = {
  w1: "e411a9be-e826-4f15-a89f-faddcde0019a",
  w3: "2e3e4e95-ff07-41a8-a922-b40cf8185325",
  w2: "ddb863d4-73c4-4c89-9654-d791c694d262",
  w5: "4c15fb13-6053-42d7-847b-993ef7d4ca73",
} as const;

const REVIEW = {
  w1: "d544d826-a5fc-40eb-9e0c-4b8cf11d3190",
  w2: "831ca1ea-50ea-4358-b97a-5ec5a5699d9b",
  w3: "3fd663a2-4be3-44c2-ad77-9caef2423ee7",
  w5: "774540b0-13a3-43b2-b040-6b907bb95664",
} as const;

const ADDRESS = {
  collector_home: "fcdafb22-fb02-4e93-979f-585de9f0c03b",
} as const;

// user.id é text (Better Auth), não UUID
const USER_ID = "user_seed_collector";

// ---------------------------------------------------------------------------

const seedArtists = [
  {
    id: ARTIST.sza,
    name: "SZA",
    slug: "sza",
    bio: "American singer-songwriter working across contemporary R&B and pop.",
  },
  {
    id: ARTIST.the_xx,
    name: "The xx",
    slug: "the-xx",
    bio: "English band known for minimalist indie pop and electronic production.",
  },
  {
    id: ARTIST.bjork,
    name: "Björk",
    slug: "bjork",
    bio: "Icelandic singer, songwriter, producer, and multidisciplinary artist.",
  },
  {
    id: ARTIST.caroline_polachek,
    name: "Caroline Polachek",
    slug: "caroline-polachek",
    bio: "American singer-songwriter and producer known for experimental pop.",
  },
  {
    id: ARTIST.yves_tumor,
    name: "Yves Tumor",
    slug: "yves-tumor",
    bio: "American artist combining experimental electronic music, art rock, and soul.",
  },
  {
    id: ARTIST.kali_uchis,
    name: "Kali Uchis",
    slug: "kali-uchis",
    bio: "Colombian-American singer-songwriter working across R&B, soul, and Latin pop.",
  },
  {
    id: ARTIST.kelela,
    name: "Kelela",
    slug: "kelela",
    bio: "American singer-songwriter blending progressive R&B and electronic music.",
  },
  {
    id: ARTIST.anri,
    name: "Anri",
    slug: "anri",
    bio: "Japanese singer-songwriter closely associated with city pop.",
  },
  {
    id: ARTIST.bad_bunny,
    name: "Bad Bunny",
    slug: "bad-bunny",
    bio: "Puerto Rican rapper and singer known for expanding Latin urban music.",
  },
  {
    id: ARTIST.fka_twigs,
    name: "FKA twigs",
    slug: "fka-twigs",
    bio: "English singer, songwriter, producer, and dancer.",
  },
  {
    id: ARTIST.lana_del_rey,
    name: "Lana Del Rey",
    slug: "lana-del-rey",
    bio: "American singer-songwriter known for cinematic alternative pop.",
  },
  {
    id: ARTIST.nine_inch_nails_boys_noize,
    name: "Nine Inch Nails & Boys Noize",
    slug: "nine-inch-nails-and-boys-noize",
    bio: "A collaborative industrial and electronic project by Nine Inch Nails and Boys Noize.",
  },
  {
    id: ARTIST.rosalia,
    name: "ROSALÍA",
    slug: "rosalia",
    bio: "Spanish singer-songwriter and producer known for experimental pop and flamenco fusion.",
  },
  {
    id: ARTIST.slayyyter,
    name: "Slayyyter",
    slug: "slayyyter",
    bio: "American singer-songwriter working across electropop and electroclash.",
  },
  {
    id: ARTIST.steve_lacy,
    name: "Steve Lacy",
    slug: "steve-lacy",
    bio: "American singer-songwriter, guitarist, and producer.",
  },
  {
    id: ARTIST.tyler_the_creator,
    name: "Tyler, The Creator",
    slug: "tyler-the-creator",
    bio: "American rapper, producer, songwriter, and designer.",
  },
  {
    id: ARTIST.weyes_blood,
    name: "Weyes Blood",
    slug: "weyes-blood",
    bio: "American singer-songwriter creating expansive chamber and baroque pop.",
  },
] satisfies NewArtist[];

const seedAlbums = [
  {
    id: ALBUM.sos,
    title: "SOS",
    artistId: ARTIST.sza,
    releaseDate: "2022-12-09",
    genre: "R&B",
    description:
      "A wide-ranging contemporary R&B album about heartbreak, confidence, and emotional recovery.",
  },
  {
    id: ALBUM.i_see_you,
    title: "I See You",
    artistId: ARTIST.the_xx,
    releaseDate: "2017-01-13",
    genre: "Indie pop",
    description:
      "An expansive indie pop album that brings brighter electronic production to the band's intimate sound.",
  },
  {
    id: ALBUM.fossora,
    title: "Fossora",
    artistId: ARTIST.bjork,
    releaseDate: "2022-09-30",
    genre: "Electronic",
    description:
      "An earthbound electronic album shaped by bass clarinets, gabber rhythms, and themes of roots and renewal.",
  },
  {
    id: ALBUM.desire_i_want_to_turn_into_you,
    title: "Desire, I Want to Turn Into You",
    artistId: ARTIST.caroline_polachek,
    releaseDate: "2023-02-14",
    genre: "Alternative pop",
    description:
      "A maximalist alternative pop album exploring desire through electronic, folk, and dance music.",
  },
  {
    id: ALBUM.praise_a_lord,
    title:
      "Praise a Lord Who Chews but Which Does Not Consume; (Or Simply, Hot Between Worlds)",
    artistId: ARTIST.yves_tumor,
    releaseDate: "2023-03-17",
    genre: "Art rock",
    description:
      "A volatile art rock album combining psychedelic guitars, electronic textures, and soulful melodies.",
  },
  {
    id: ALBUM.lp1,
    title: "LP1",
    artistId: ARTIST.fka_twigs,
    releaseDate: "2014-08-06",
    genre: "Alternative R&B",
    description:
      "A sparse and futuristic debut album combining experimental production with intimate R&B songwriting.",
  },
  {
    id: ALBUM.red_moon_in_venus,
    title: "Red Moon in Venus",
    artistId: ARTIST.kali_uchis,
    releaseDate: "2023-03-03",
    genre: "R&B",
    description:
      "A lush bilingual R&B and soul album centered on love, desire, and emotional transformation.",
  },
  {
    id: ALBUM.raven,
    title: "Raven",
    artistId: ARTIST.kelela,
    releaseDate: "2023-02-10",
    genre: "Alternative R&B",
    description:
      "A progressive R&B album moving through ambient electronics, club rhythms, redemption, and self-reliance.",
  },
  {
    id: ALBUM.timely,
    title: "Timely!!",
    artistId: ARTIST.anri,
    releaseDate: "1983-12-05",
    genre: "City pop",
    description:
      "A defining city pop album filled with polished arrangements and summer atmosphere.",
  },
  {
    id: ALBUM.un_verano_sin_ti,
    title: "Un Verano Sin Ti",
    artistId: ARTIST.bad_bunny,
    releaseDate: "2022-05-06",
    genre: "Reggaeton",
    description:
      "A Caribbean-inspired album that moves between reggaeton, Latin trap, and bittersweet summer songs.",
  },
  {
    id: ALBUM.caprisongs,
    title: "CAPRISONGS",
    artistId: ARTIST.fka_twigs,
    releaseDate: "2022-01-14",
    genre: "Alternative R&B",
    description:
      "A playful mixtape combining alternative R&B, pop, dancehall, and UK club music.",
  },
  {
    id: ALBUM.did_you_know_ocean_blvd,
    title: "Did you know that there's a tunnel under Ocean Blvd",
    artistId: ARTIST.lana_del_rey,
    releaseDate: "2023-03-24",
    genre: "Alternative pop",
    description:
      "An introspective album exploring family, memory, faith, and mortality through orchestral pop and piano ballads.",
  },
  {
    id: ALBUM.nine_inch_noize,
    title: "Nine Inch Noize",
    artistId: ARTIST.nine_inch_nails_boys_noize,
    releaseDate: "2026-04-17",
    genre: "Industrial electronic",
    description:
      "A collaborative release that reframes Nine Inch Nails material through industrial and electronic production.",
  },
  {
    id: ALBUM.motomami,
    title: "MOTOMAMI",
    artistId: ARTIST.rosalia,
    releaseDate: "2022-03-18",
    genre: "Experimental pop",
    description:
      "An experimental pop album blending reggaeton, flamenco, electronic production, and sparse balladry.",
  },
  {
    id: ALBUM.worst_girl_in_america,
    title: "WOR$T GIRL IN AMERICA",
    artistId: ARTIST.slayyyter,
    releaseDate: "2026-03-27",
    genre: "Electroclash",
    description:
      "A maximalist pop album built around electroclash, distorted club production, and Tumblr-era nostalgia.",
  },
  {
    id: ALBUM.gemini_rights,
    title: "Gemini Rights",
    artistId: ARTIST.steve_lacy,
    releaseDate: "2022-07-15",
    genre: "R&B",
    description:
      "A concise breakup album bringing together R&B, funk, rock, jazz, and psychedelic pop.",
  },
  {
    id: ALBUM.flower_boy,
    title: "Flower Boy",
    artistId: ARTIST.tyler_the_creator,
    releaseDate: "2017-07-21",
    genre: "Hip-hop",
    description:
      "An introspective hip-hop album shaped by lush arrangements, neo-soul, jazz, and themes of loneliness.",
  },
  {
    id: ALBUM.and_in_the_darkness_hearts_aglow,
    title: "And in the Darkness, Hearts Aglow",
    artistId: ARTIST.weyes_blood,
    releaseDate: "2022-11-18",
    genre: "Chamber pop",
    description:
      "A sweeping chamber pop album about connection, instability, and searching for meaning in difficult times.",
  },
] satisfies NewAlbum[];

const seedProducts = [
  {
    id: PRODUCT.w1,
    albumId: ALBUM.sos,
    sku: "VINYL-SZA-SOS-STD",
    format: "vinyl",
    edition: "standard",
    price: "105.90",
    stockQuantity: 12,
    isImported: true,
    createdAt: new Date("2026-08-31T18:00:00.000Z"),
  },
  {
    id: PRODUCT.w2,
    albumId: ALBUM.i_see_you,
    sku: "VINYL-THEXX-ISEEYOU-DLX",
    format: "vinyl",
    edition: "deluxe",
    price: "105.90",
    stockQuantity: 6,
    isImported: true,
    createdAt: new Date("2026-08-30T18:00:00.000Z"),
  },
  {
    id: PRODUCT.w3,
    albumId: ALBUM.fossora,
    sku: "VINYL-BJORK-FOSSORA-STD",
    format: "vinyl",
    edition: "standard",
    price: "89.90",
    compareAtPrice: "109.90",
    stockQuantity: 9,
    isImported: true,
    createdAt: new Date("2026-08-29T18:00:00.000Z"),
  },
  {
    id: PRODUCT.w5,
    albumId: ALBUM.desire_i_want_to_turn_into_you,
    sku: "VINYL-CAROLINE-DESIRE-CLR",
    format: "vinyl",
    edition: "colored",
    price: "115.90",
    compareAtPrice: "139.90",
    stockQuantity: 4,
    isImported: true,
    createdAt: new Date("2026-08-28T18:00:00.000Z"),
  },
  {
    id: PRODUCT.w6,
    albumId: ALBUM.praise_a_lord,
    sku: "VINYL-YVESTUMOR-PRAISE-STD",
    format: "vinyl",
    edition: "standard",
    price: "105.90",
    stockQuantity: 0,
    isImported: true,
    createdAt: new Date("2026-08-27T18:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_lp1,
    albumId: ALBUM.lp1,
    sku: "VINYL-FKATWIGS-LP1-STD",
    format: "vinyl",
    edition: "standard",
    price: "219.90",
    stockQuantity: 7,
    isImported: true,
    createdAt: new Date("2026-08-26T18:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_red_moon_in_venus,
    albumId: ALBUM.red_moon_in_venus,
    sku: "VINYL-KALIUCHIS-REDMOON-STD",
    format: "vinyl",
    edition: "standard",
    price: "239.90",
    stockQuantity: 8,
    isImported: true,
    createdAt: new Date("2026-08-25T18:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_raven,
    albumId: ALBUM.raven,
    sku: "VINYL-KELELA-RAVEN-STD",
    format: "vinyl",
    edition: "standard",
    price: "229.90",
    stockQuantity: 6,
    isImported: true,
    createdAt: new Date("2026-08-24T18:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_timely,
    albumId: ALBUM.timely,
    sku: "VINYL-ANRI-TIMELY-STD",
    format: "vinyl",
    edition: "standard",
    price: "239.90",
    stockQuantity: 8,
    isImported: true,
    createdAt: new Date("2026-09-01T19:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_un_verano_sin_ti,
    albumId: ALBUM.un_verano_sin_ti,
    sku: "VINYL-BADBUNNY-UVST-STD",
    format: "vinyl",
    edition: "standard",
    price: "289.90",
    stockQuantity: 10,
    isImported: true,
    createdAt: new Date("2026-09-01T18:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_caprisongs,
    albumId: ALBUM.caprisongs,
    sku: "VINYL-FKATWIGS-CAPRI-CLR",
    format: "vinyl",
    edition: "colored",
    price: "229.90",
    stockQuantity: 6,
    isImported: true,
    createdAt: new Date("2026-09-01T17:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_did_you_know_ocean_blvd,
    albumId: ALBUM.did_you_know_ocean_blvd,
    sku: "VINYL-LANA-OCEANBLVD-DLX",
    format: "vinyl",
    edition: "deluxe",
    price: "329.90",
    stockQuantity: 5,
    isImported: true,
    createdAt: new Date("2026-09-01T16:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_nine_inch_noize,
    albumId: ALBUM.nine_inch_noize,
    sku: "VINYL-NIN-NOIZE-STD",
    format: "vinyl",
    edition: "standard",
    price: "279.90",
    stockQuantity: 4,
    isImported: true,
    createdAt: new Date("2026-09-01T15:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_motomami,
    albumId: ALBUM.motomami,
    sku: "VINYL-ROSALIA-MOTOMAMI-STD",
    format: "vinyl",
    edition: "standard",
    price: "249.90",
    stockQuantity: 9,
    isImported: true,
    createdAt: new Date("2026-09-01T14:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_worst_girl_in_america,
    albumId: ALBUM.worst_girl_in_america,
    sku: "VINYL-SLAYYYTER-WGIA-CLR",
    format: "vinyl",
    edition: "colored",
    price: "259.90",
    stockQuantity: 5,
    isImported: true,
    createdAt: new Date("2026-09-01T13:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_gemini_rights,
    albumId: ALBUM.gemini_rights,
    sku: "VINYL-STEVELACY-GEMINI-STD",
    format: "vinyl",
    edition: "standard",
    price: "219.90",
    stockQuantity: 7,
    isImported: true,
    createdAt: new Date("2026-09-01T12:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_flower_boy,
    albumId: ALBUM.flower_boy,
    sku: "VINYL-TYLER-FLOWERBOY-CLR",
    format: "vinyl",
    edition: "colored",
    price: "269.90",
    stockQuantity: 8,
    isImported: true,
    createdAt: new Date("2026-09-01T11:00:00.000Z"),
  },
  {
    id: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    albumId: ALBUM.and_in_the_darkness_hearts_aglow,
    sku: "VINYL-WEYESBLOOD-HEARTS-CLR",
    format: "vinyl",
    edition: "colored",
    price: "249.90",
    stockQuantity: 6,
    isImported: true,
    createdAt: new Date("2026-09-01T10:00:00.000Z"),
  },
] satisfies NewProduct[];

const seedProductImages = [
  {
    id: IMAGE.w1,
    productId: PRODUCT.w1,
    url: `${R2_PUBLIC_URL}/sza-sos.png`,
    position: 0,
    altText: "SOS by SZA — album cover",
  },
  {
    id: IMAGE.w2,
    productId: PRODUCT.w2,
    url: `${R2_PUBLIC_URL}/the-xx-i-see-you.png`,
    position: 0,
    altText: "I See You by The xx — album cover",
  },
  {
    id: IMAGE.w3,
    productId: PRODUCT.w3,
    url: `${R2_PUBLIC_URL}/bjork-fossora.png`,
    position: 0,
    altText: "Fossora by Björk — album cover",
  },
  {
    id: IMAGE.w5,
    productId: PRODUCT.w5,
    url: `${R2_PUBLIC_URL}/caroline-polachek-desire-i-want-to-turn-into-you.png`,
    position: 0,
    altText:
      "Desire, I Want to Turn Into You by Caroline Polachek — album cover",
  },
  {
    id: IMAGE.w6,
    productId: PRODUCT.w6,
    url: `${R2_PUBLIC_URL}/yves-tumor-praise-a-lord-who-chews-but-which-does-not-consume-or-simply-hot-between-worlds.png`,
    position: 0,
    altText:
      "Praise a Lord Who Chews but Which Does Not Consume; (Or Simply, Hot Between Worlds) by Yves Tumor — album cover",
  },
  {
    id: IMAGE.vinyl_lp1,
    productId: PRODUCT.vinyl_lp1,
    url: `${R2_PUBLIC_URL}/fka-twigs-lp1.png`,
    position: 0,
    altText: "LP1 by FKA twigs — album cover",
  },
  {
    id: IMAGE.vinyl_red_moon_in_venus,
    productId: PRODUCT.vinyl_red_moon_in_venus,
    url: `${R2_PUBLIC_URL}/kali-uchis-red-moon-in-venus.png`,
    position: 0,
    altText: "Red Moon in Venus by Kali Uchis — album cover",
  },
  {
    id: IMAGE.vinyl_raven,
    productId: PRODUCT.vinyl_raven,
    url: `${R2_PUBLIC_URL}/kelela-raven.png`,
    position: 0,
    altText: "Raven by Kelela — album cover",
  },
  {
    id: IMAGE.vinyl_timely,
    productId: PRODUCT.vinyl_timely,
    url: `${R2_PUBLIC_URL}/anri-timely.jpg`,
    position: 0,
    altText: "Timely!! by Anri — album cover",
  },
  {
    id: IMAGE.vinyl_un_verano_sin_ti,
    productId: PRODUCT.vinyl_un_verano_sin_ti,
    url: `${R2_PUBLIC_URL}/bad-bunny-un-verano-sin-ti.jpg`,
    position: 0,
    altText: "Un Verano Sin Ti by Bad Bunny — album cover",
  },
  {
    id: IMAGE.vinyl_caprisongs,
    productId: PRODUCT.vinyl_caprisongs,
    url: `${R2_PUBLIC_URL}/fka-twigs-caprisongs.jpg`,
    position: 0,
    altText: "CAPRISONGS by FKA twigs — album cover",
  },
  {
    id: IMAGE.vinyl_did_you_know_ocean_blvd,
    productId: PRODUCT.vinyl_did_you_know_ocean_blvd,
    url: `${R2_PUBLIC_URL}/lana-del-rey-did-you-know-theres-a-tunnel.jpg`,
    position: 0,
    altText:
      "Did you know that there's a tunnel under Ocean Blvd by Lana Del Rey — album cover",
  },
  {
    id: IMAGE.vinyl_nine_inch_noize,
    productId: PRODUCT.vinyl_nine_inch_noize,
    url: `${R2_PUBLIC_URL}/nine-inch-nails-nine-inch-noize.jpg`,
    position: 0,
    altText: "Nine Inch Noize by Nine Inch Nails & Boys Noize — album cover",
  },
  {
    id: IMAGE.vinyl_motomami,
    productId: PRODUCT.vinyl_motomami,
    url: `${R2_PUBLIC_URL}/rosalia-motomami.webp`,
    position: 0,
    altText: "MOTOMAMI by ROSALÍA — album cover",
  },
  {
    id: IMAGE.vinyl_worst_girl_in_america,
    productId: PRODUCT.vinyl_worst_girl_in_america,
    url: `${R2_PUBLIC_URL}/slayyyter-worst-girl-in-america.jpg`,
    position: 0,
    altText: "WOR$T GIRL IN AMERICA by Slayyyter — album cover",
  },
  {
    id: IMAGE.vinyl_gemini_rights,
    productId: PRODUCT.vinyl_gemini_rights,
    url: `${R2_PUBLIC_URL}/steve-lacy-gemini-rights.jpg`,
    position: 0,
    altText: "Gemini Rights by Steve Lacy — album cover",
  },
  {
    id: IMAGE.vinyl_flower_boy,
    productId: PRODUCT.vinyl_flower_boy,
    url: `${R2_PUBLIC_URL}/tyler-the-creator-flower-boy.jpg`,
    position: 0,
    altText: "Flower Boy by Tyler, The Creator — album cover",
  },
  {
    id: IMAGE.vinyl_and_in_the_darkness_hearts_aglow,
    productId: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    url: `${R2_PUBLIC_URL}/weyes-blood-in-the-darkness-we-glow.jpg`,
    position: 0,
    altText: "And in the Darkness, Hearts Aglow by Weyes Blood — album cover",
  },
] satisfies NewProductImage[];

const coverProductIds = new Set(
  seedProductImages
    .filter((image) => image.position === 0)
    .map((image) => image.productId),
);
const albumIdsWithCover = new Set(
  seedProducts
    .filter((product) => coverProductIds.has(product.id))
    .map((product) => product.albumId),
);
const albumsWithoutCover = seedAlbums.filter(
  (album) => !albumIdsWithCover.has(album.id),
);

if (albumsWithoutCover.length > 0) {
  throw new Error(
    `Every seeded album must have a cover. Missing covers for: ${albumsWithoutCover
      .map((album) => album.id)
      .join(", ")}`,
  );
}

const seedCategories = [
  {
    id: CATEGORY.electronic,
    name: "Electronic",
    slug: "electronic",
    type: "genre",
  },
  {
    id: CATEGORY.indie_pop,
    name: "Indie Pop",
    slug: "indie-pop",
    type: "genre",
  },
  { id: CATEGORY.art_rock, name: "Art Rock", slug: "art-rock", type: "genre" },
  {
    id: CATEGORY.experimental,
    name: "Experimental",
    slug: "experimental",
    type: "tag",
  },
  {
    id: CATEGORY.staff_picks,
    name: "Staff Picks",
    slug: "staff-picks",
    type: "curated",
  },
  { id: CATEGORY.city_pop, name: "City Pop", slug: "city-pop", type: "genre" },
  {
    id: CATEGORY.reggaeton,
    name: "Reggaeton",
    slug: "reggaeton",
    type: "genre",
  },
  {
    id: CATEGORY.alternative_rnb,
    name: "Alternative R&B",
    slug: "alternative-r-and-b",
    type: "genre",
  },
  {
    id: CATEGORY.alternative_pop,
    name: "Alternative Pop",
    slug: "alternative-pop",
    type: "genre",
  },
  {
    id: CATEGORY.industrial_electronic,
    name: "Industrial Electronic",
    slug: "industrial-electronic",
    type: "genre",
  },
  {
    id: CATEGORY.experimental_pop,
    name: "Experimental Pop",
    slug: "experimental-pop",
    type: "genre",
  },
  {
    id: CATEGORY.electroclash,
    name: "Electroclash",
    slug: "electroclash",
    type: "genre",
  },
  { id: CATEGORY.rnb, name: "R&B", slug: "r-and-b", type: "genre" },
  { id: CATEGORY.hip_hop, name: "Hip-Hop", slug: "hip-hop", type: "genre" },
  {
    id: CATEGORY.chamber_pop,
    name: "Chamber Pop",
    slug: "chamber-pop",
    type: "genre",
  },
] satisfies NewCategory[];

const seedProductCategories = [
  { productId: PRODUCT.w1, categoryId: CATEGORY.rnb },
  { productId: PRODUCT.w1, categoryId: CATEGORY.staff_picks },
  { productId: PRODUCT.w2, categoryId: CATEGORY.indie_pop },
  { productId: PRODUCT.w3, categoryId: CATEGORY.electronic },
  { productId: PRODUCT.w3, categoryId: CATEGORY.staff_picks },
  { productId: PRODUCT.w5, categoryId: CATEGORY.alternative_pop },
  { productId: PRODUCT.w6, categoryId: CATEGORY.art_rock },
  { productId: PRODUCT.w6, categoryId: CATEGORY.staff_picks },
  { productId: PRODUCT.vinyl_lp1, categoryId: CATEGORY.alternative_rnb },
  { productId: PRODUCT.vinyl_red_moon_in_venus, categoryId: CATEGORY.rnb },
  { productId: PRODUCT.vinyl_raven, categoryId: CATEGORY.alternative_rnb },
  { productId: PRODUCT.vinyl_timely, categoryId: CATEGORY.city_pop },
  { productId: PRODUCT.vinyl_timely, categoryId: CATEGORY.staff_picks },
  { productId: PRODUCT.vinyl_un_verano_sin_ti, categoryId: CATEGORY.reggaeton },
  { productId: PRODUCT.vinyl_caprisongs, categoryId: CATEGORY.alternative_rnb },
  {
    productId: PRODUCT.vinyl_did_you_know_ocean_blvd,
    categoryId: CATEGORY.alternative_pop,
  },
  {
    productId: PRODUCT.vinyl_nine_inch_noize,
    categoryId: CATEGORY.industrial_electronic,
  },
  { productId: PRODUCT.vinyl_motomami, categoryId: CATEGORY.experimental_pop },
  { productId: PRODUCT.vinyl_motomami, categoryId: CATEGORY.staff_picks },
  {
    productId: PRODUCT.vinyl_worst_girl_in_america,
    categoryId: CATEGORY.electroclash,
  },
  { productId: PRODUCT.vinyl_gemini_rights, categoryId: CATEGORY.rnb },
  { productId: PRODUCT.vinyl_flower_boy, categoryId: CATEGORY.hip_hop },
  { productId: PRODUCT.vinyl_flower_boy, categoryId: CATEGORY.staff_picks },
  {
    productId: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    categoryId: CATEGORY.chamber_pop,
  },
  {
    productId: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    categoryId: CATEGORY.staff_picks,
  },
] satisfies (typeof productCategories.$inferInsert)[];

const seedProductTags = [
  { productId: PRODUCT.w1, tag: "contemporary R&B" },
  { productId: PRODUCT.w1, tag: "heartbreak" },
  { productId: PRODUCT.w2, tag: "deluxe edition" },
  { productId: PRODUCT.w2, tag: "indie pop" },
  { productId: PRODUCT.w3, tag: "electronic" },
  { productId: PRODUCT.w3, tag: "on sale" },
  { productId: PRODUCT.w5, tag: "colored vinyl" },
  { productId: PRODUCT.w5, tag: "on sale" },
  { productId: PRODUCT.w6, tag: "art rock" },
  { productId: PRODUCT.w6, tag: "out of stock" },
  { productId: PRODUCT.vinyl_lp1, tag: "experimental" },
  { productId: PRODUCT.vinyl_lp1, tag: "alternative R&B" },
  { productId: PRODUCT.vinyl_red_moon_in_venus, tag: "bilingual" },
  { productId: PRODUCT.vinyl_red_moon_in_venus, tag: "soul" },
  { productId: PRODUCT.vinyl_raven, tag: "progressive R&B" },
  { productId: PRODUCT.vinyl_raven, tag: "electronic" },
  { productId: PRODUCT.vinyl_timely, tag: "city pop" },
  { productId: PRODUCT.vinyl_timely, tag: "Japanese" },
  { productId: PRODUCT.vinyl_un_verano_sin_ti, tag: "Latin" },
  { productId: PRODUCT.vinyl_un_verano_sin_ti, tag: "summer" },
  { productId: PRODUCT.vinyl_caprisongs, tag: "mixtape" },
  { productId: PRODUCT.vinyl_caprisongs, tag: "UK club" },
  { productId: PRODUCT.vinyl_did_you_know_ocean_blvd, tag: "cinematic" },
  {
    productId: PRODUCT.vinyl_did_you_know_ocean_blvd,
    tag: "singer-songwriter",
  },
  { productId: PRODUCT.vinyl_nine_inch_noize, tag: "industrial" },
  { productId: PRODUCT.vinyl_nine_inch_noize, tag: "remixes" },
  { productId: PRODUCT.vinyl_motomami, tag: "experimental" },
  { productId: PRODUCT.vinyl_motomami, tag: "flamenco" },
  { productId: PRODUCT.vinyl_worst_girl_in_america, tag: "electroclash" },
  { productId: PRODUCT.vinyl_worst_girl_in_america, tag: "club" },
  { productId: PRODUCT.vinyl_gemini_rights, tag: "psychedelic soul" },
  { productId: PRODUCT.vinyl_gemini_rights, tag: "breakup album" },
  { productId: PRODUCT.vinyl_flower_boy, tag: "neo-soul" },
  { productId: PRODUCT.vinyl_flower_boy, tag: "introspective" },
  {
    productId: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    tag: "baroque pop",
  },
  {
    productId: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    tag: "melancholic",
  },
] satisfies (typeof productTags.$inferInsert)[];

const seedInventoryMovements = [
  {
    id: INVENTORY.initial_w1,
    productId: PRODUCT.w1,
    type: "inbound",
    quantity: 17,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.sales_w1,
    productId: PRODUCT.w1,
    type: "outbound",
    quantity: 5,
    reason: "Delivered seed order",
  },
  {
    id: INVENTORY.initial_w2,
    productId: PRODUCT.w2,
    type: "inbound",
    quantity: 8,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.sales_w2,
    productId: PRODUCT.w2,
    type: "outbound",
    quantity: 2,
    reason: "Delivered seed order",
  },
  {
    id: INVENTORY.initial_w3,
    productId: PRODUCT.w3,
    type: "inbound",
    quantity: 12,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.sales_w3,
    productId: PRODUCT.w3,
    type: "outbound",
    quantity: 3,
    reason: "Delivered seed order",
  },
  {
    id: INVENTORY.initial_w5,
    productId: PRODUCT.w5,
    type: "inbound",
    quantity: 5,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.sales_w5,
    productId: PRODUCT.w5,
    type: "outbound",
    quantity: 1,
    reason: "Delivered seed order",
  },
  {
    id: INVENTORY.initial_vinyl_lp1,
    productId: PRODUCT.vinyl_lp1,
    type: "inbound",
    quantity: 7,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_red_moon_in_venus,
    productId: PRODUCT.vinyl_red_moon_in_venus,
    type: "inbound",
    quantity: 8,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_raven,
    productId: PRODUCT.vinyl_raven,
    type: "inbound",
    quantity: 6,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_timely,
    productId: PRODUCT.vinyl_timely,
    type: "inbound",
    quantity: 8,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_un_verano_sin_ti,
    productId: PRODUCT.vinyl_un_verano_sin_ti,
    type: "inbound",
    quantity: 10,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_caprisongs,
    productId: PRODUCT.vinyl_caprisongs,
    type: "inbound",
    quantity: 6,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_did_you_know_ocean_blvd,
    productId: PRODUCT.vinyl_did_you_know_ocean_blvd,
    type: "inbound",
    quantity: 5,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_nine_inch_noize,
    productId: PRODUCT.vinyl_nine_inch_noize,
    type: "inbound",
    quantity: 4,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_motomami,
    productId: PRODUCT.vinyl_motomami,
    type: "inbound",
    quantity: 9,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_worst_girl_in_america,
    productId: PRODUCT.vinyl_worst_girl_in_america,
    type: "inbound",
    quantity: 5,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_gemini_rights,
    productId: PRODUCT.vinyl_gemini_rights,
    type: "inbound",
    quantity: 7,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_flower_boy,
    productId: PRODUCT.vinyl_flower_boy,
    type: "inbound",
    quantity: 8,
    reason: "Initial seed stock",
  },
  {
    id: INVENTORY.initial_vinyl_and_in_the_darkness_hearts_aglow,
    productId: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    type: "inbound",
    quantity: 6,
    reason: "Initial seed stock",
  },
] satisfies NewInventoryMovement[];

const seedUsers = [
  {
    id: USER_ID,
    name: "Spinova Collector",
    email: "collector@spinova.local",
    emailVerified: true,
    lang: "pt-BR",
  },
] satisfies (typeof user.$inferInsert)[];

const seedAddresses = [
  {
    id: ADDRESS.collector_home,
    userId: USER_ID,
    label: "Casa",
    street: "Rua dos Discos",
    number: "33",
    city: "São Paulo",
    state: "SP",
    zipCode: "01000-000",
    country: "BR",
    isDefault: true,
  },
] satisfies NewAddress[];

const seedOrders = [
  {
    id: ORDER.seed_delivered,
    userId: USER_ID,
    status: "delivered",
    total: "1126.90",
    addressId: ADDRESS.collector_home,
    createdAt: new Date("2026-08-25T15:00:00.000Z"),
  },
] satisfies NewOrder[];

const seedOrderItems = [
  {
    id: ORDER_ITEM.w1,
    orderId: ORDER.seed_delivered,
    productId: PRODUCT.w1,
    quantity: 5,
    unitPrice: "105.90",
  },
  {
    id: ORDER_ITEM.w3,
    orderId: ORDER.seed_delivered,
    productId: PRODUCT.w3,
    quantity: 3,
    unitPrice: "89.90",
  },
  {
    id: ORDER_ITEM.w2,
    orderId: ORDER.seed_delivered,
    productId: PRODUCT.w2,
    quantity: 2,
    unitPrice: "105.90",
  },
  {
    id: ORDER_ITEM.w5,
    orderId: ORDER.seed_delivered,
    productId: PRODUCT.w5,
    quantity: 1,
    unitPrice: "115.90",
  },
] satisfies NewOrderItem[];

const seedReviews = [
  {
    id: REVIEW.w1,
    productId: PRODUCT.w1,
    userId: USER_ID,
    rating: 5,
    comment: "Quiet pressing with excellent dynamics.",
  },
  {
    id: REVIEW.w2,
    productId: PRODUCT.w2,
    userId: USER_ID,
    rating: 4,
    comment: "Great package and clean playback.",
  },
  {
    id: REVIEW.w3,
    productId: PRODUCT.w3,
    userId: USER_ID,
    rating: 5,
    comment: "A detailed pressing that makes the album's low end feel immense.",
  },
  {
    id: REVIEW.w5,
    productId: PRODUCT.w5,
    userId: USER_ID,
    rating: 4,
    comment: "The colored vinyl looks great and sounds balanced.",
  },
] satisfies NewReview[];

const seedFeaturedSections = [
  {
    id: SECTION.home_releases,
    slug: "home-releases",
    title: "Lançamentos",
    type: "carousel",
    position: 0,
  },
  {
    id: SECTION.home_recommendations,
    slug: "home-recommendations",
    title: "Recomendações",
    type: "carousel",
    position: 1,
  },
] satisfies NewFeaturedSection[];

const seedFeaturedItems = [
  {
    id: FEAT_ITEM.releases_vinyl_nine_inch_noize,
    sectionId: SECTION.home_releases,
    productId: PRODUCT.vinyl_nine_inch_noize,
    position: 0,
  },
  {
    id: FEAT_ITEM.releases_vinyl_worst_girl_in_america,
    sectionId: SECTION.home_releases,
    productId: PRODUCT.vinyl_worst_girl_in_america,
    position: 1,
  },
  {
    id: FEAT_ITEM.releases_w1,
    sectionId: SECTION.home_releases,
    productId: PRODUCT.w1,
    position: 2,
  },
  {
    id: FEAT_ITEM.releases_w2,
    sectionId: SECTION.home_releases,
    productId: PRODUCT.w2,
    position: 3,
  },
  {
    id: FEAT_ITEM.releases_w3,
    sectionId: SECTION.home_releases,
    productId: PRODUCT.w3,
    position: 4,
  },
  {
    id: FEAT_ITEM.recs_vinyl_timely,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.vinyl_timely,
    position: 0,
  },
  {
    id: FEAT_ITEM.recs_vinyl_motomami,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.vinyl_motomami,
    position: 1,
  },
  {
    id: FEAT_ITEM.recs_vinyl_flower_boy,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.vinyl_flower_boy,
    position: 2,
  },
  {
    id: FEAT_ITEM.recs_vinyl_hearts_aglow,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.vinyl_and_in_the_darkness_hearts_aglow,
    position: 3,
  },
  {
    id: FEAT_ITEM.recs_w2,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.w2,
    position: 4,
  },
  {
    id: FEAT_ITEM.recs_w3,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.w3,
    position: 5,
  },
  {
    id: FEAT_ITEM.recs_w5,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.w5,
    position: 6,
  },
  {
    id: FEAT_ITEM.recs_w6,
    sectionId: SECTION.home_recommendations,
    productId: PRODUCT.w6,
    position: 7,
  },
] satisfies NewFeaturedItem[];

const pool = new Pool({ connectionString: env.DATABASE_URL });
const database = drizzle(pool);

async function seed() {
  await database.transaction(async (transaction) => {
    await transaction
      .insert(artists)
      .values(seedArtists)
      .onConflictDoUpdate({
        target: artists.id,
        set: {
          name: sql`excluded."name"`,
          slug: sql`excluded."slug"`,
          imageUrl: sql`excluded."image_url"`,
          bio: sql`excluded."bio"`,
        },
      });

    await transaction
      .insert(albums)
      .values(seedAlbums)
      .onConflictDoUpdate({
        target: albums.id,
        set: {
          title: sql`excluded."title"`,
          artistId: sql`excluded."artist_id"`,
          releaseDate: sql`excluded."release_date"`,
          genre: sql`excluded."genre"`,
          description: sql`excluded."description"`,
        },
      });

    await transaction
      .insert(products)
      .values(seedProducts)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          albumId: sql`excluded."album_id"`,
          sku: sql`excluded."sku"`,
          format: sql`excluded."format"`,
          edition: sql`excluded."edition"`,
          price: sql`excluded."price"`,
          compareAtPrice: sql`excluded."compare_at_price"`,
          stockQuantity: sql`excluded."stock_quantity"`,
          isImported: sql`excluded."is_imported"`,
          createdAt: sql`excluded."created_at"`,
        },
      });

    await transaction
      .insert(productImages)
      .values(seedProductImages)
      .onConflictDoUpdate({
        target: [productImages.productId, productImages.position],
        set: {
          url: sql`excluded."url"`,
          altText: sql`excluded."alt_text"`,
        },
      });

    await transaction
      .insert(categories)
      .values(seedCategories)
      .onConflictDoUpdate({
        target: categories.id,
        set: {
          name: sql`excluded."name"`,
          slug: sql`excluded."slug"`,
          type: sql`excluded."type"`,
        },
      });

    const productIds = seedProducts.map((product) => product.id);

    await transaction
      .delete(productCategories)
      .where(inArray(productCategories.productId, productIds));
    await transaction.insert(productCategories).values(seedProductCategories);

    await transaction
      .delete(productTags)
      .where(inArray(productTags.productId, productIds));
    await transaction.insert(productTags).values(seedProductTags);

    await transaction
      .insert(inventoryMovements)
      .values(seedInventoryMovements)
      .onConflictDoUpdate({
        target: inventoryMovements.id,
        set: {
          productId: sql`excluded."product_id"`,
          type: sql`excluded."type"`,
          quantity: sql`excluded."quantity"`,
          reason: sql`excluded."reason"`,
        },
      });

    await transaction
      .insert(featuredSections)
      .values(seedFeaturedSections)
      .onConflictDoUpdate({
        target: featuredSections.id,
        set: {
          slug: sql`excluded."slug"`,
          title: sql`excluded."title"`,
          type: sql`excluded."type"`,
          position: sql`excluded."position"`,
        },
      });

    const sectionIds = seedFeaturedSections.map((section) => section.id);
    await transaction
      .delete(featuredItems)
      .where(inArray(featuredItems.sectionId, sectionIds));
    await transaction.insert(featuredItems).values(seedFeaturedItems);

    await transaction
      .insert(user)
      .values(seedUsers)
      .onConflictDoUpdate({
        target: user.id,
        set: {
          name: sql`excluded."name"`,
          email: sql`excluded."email"`,
          emailVerified: sql`excluded."email_verified"`,
          lang: sql`excluded."lang"`,
          updatedAt: sql`excluded."updated_at"`,
        },
      });

    await transaction
      .insert(addresses)
      .values(seedAddresses)
      .onConflictDoUpdate({
        target: addresses.id,
        set: {
          userId: sql`excluded."user_id"`,
          label: sql`excluded."label"`,
          street: sql`excluded."street"`,
          number: sql`excluded."number"`,
          complement: sql`excluded."complement"`,
          city: sql`excluded."city"`,
          state: sql`excluded."state"`,
          zipCode: sql`excluded."zip_code"`,
          country: sql`excluded."country"`,
          isDefault: sql`excluded."is_default"`,
        },
      });

    await transaction
      .insert(orders)
      .values(seedOrders)
      .onConflictDoUpdate({
        target: orders.id,
        set: {
          userId: sql`excluded."user_id"`,
          status: sql`excluded."status"`,
          total: sql`excluded."total"`,
          addressId: sql`excluded."address_id"`,
          createdAt: sql`excluded."created_at"`,
        },
      });

    await transaction
      .insert(orderItems)
      .values(seedOrderItems)
      .onConflictDoUpdate({
        target: orderItems.id,
        set: {
          orderId: sql`excluded."order_id"`,
          productId: sql`excluded."product_id"`,
          quantity: sql`excluded."quantity"`,
          unitPrice: sql`excluded."unit_price"`,
        },
      });

    await transaction
      .insert(reviews)
      .values(seedReviews)
      .onConflictDoUpdate({
        target: [reviews.userId, reviews.productId],
        set: {
          rating: sql`excluded."rating"`,
          comment: sql`excluded."comment"`,
        },
      });
  });
}

try {
  await seed();
  console.info(
    `Seed completed: ${seedArtists.length} artists, ${seedAlbums.length} albums, ${seedProducts.length} products, ${seedCategories.length} categories, and ${seedReviews.length} reviews.`,
  );
} catch (error) {
  console.error("Failed to seed the database.", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
