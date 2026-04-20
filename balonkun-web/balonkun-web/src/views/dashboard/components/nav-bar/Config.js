export const NAVBAR_LIST = [
  {
    key: "SEAT_COVERS",
    label: "Seat Covers",
    children: [
      {
        label: "4W",
        items: [
          { label: "Luxury Custom Fit", path: "/products/car-seat-covers", icon: "airline_seat_recline_extra" },
          { label: "Premium Leatherette", path: "/products/car-seat-covers", icon: "stars" },
          { label: "Universal Fit", path: "/products/car-seat-covers", icon: "grid_view" },
        ]
      },
      {
        label: "2W",
        items: [
          { label: "Bike Covers", path: "/products/two-wheeler-seat-covers", icon: "moped" },
          { label: "Scooter Covers", path: "/products/two-wheeler-seat-covers", icon: "scooter" },
        ]
      }
    ]
  },
  {
    key: "ACCESSORIES",
    label: "Accessories",
    children: [
      {
        label: "4W ACCESSORIES",
        items: [
          { label: "Car Care", path: "/products/car-care", icon: "clean_hands" },
          { label: "Comfort Accessories", path: "/products/comfort-accessories", icon: "weekend" },
          { label: "Mobile Accessories", path: "/products/mobile-holders", icon: "smartphone" },
          { label: "Organisers", path: "/products/organisers", icon: "inventory_2" },
          { label: "Padded Seat Cover", path: "/products/padded-seat-cover", icon: "airline_seat_recline_normal" },
          { label: "Steering Covers", path: "/products/steering-covers", icon: "settings_input_component" },
          { label: "Tissue Boxes", path: "/products/tissue-boxes", icon: "featured_play_list" },
          { label: "Utilities", path: "/products/utilities", icon: "handyman" },
          { label: "EV Accessories", path: "/products/ev-accessories", icon: "ev_station" },
        ]
      },
      {
        label: "2W ACCESSORIES",
        items: [
          { label: "Bike Body Covers", path: "/products/bike-body-covers", icon: "moped" },
          { label: "Scooty Body Covers", path: "/products/scooty-body-covers", icon: "scooter" },
          { label: "Tank Covers", path: "/products/tank-covers", icon: "oil_barrel" },
          { label: "Mobile Holders", path: "/products/mobile-holders", icon: "phonelink_setup" },
          { label: "Bags", path: "/products/bags", icon: "shopping_bag" },
          { label: "Microfibre Cleaning Cloth", path: "/products/microfibre-cleaning-cloth", icon: "dry_cleaning" },
          { label: "Bungee Ropes", path: "/products/bungee-ropes", icon: "cable" },
        ]
      }
    ]
  },
  { 
    key: "MATS", 
    label: "Mats",
    children: [
      { label: "7D U Max 2 Row", path: "/products/7d-u-max-2-row" },
      { label: "7d Car Mat", path: "/products/autoform-car-mats" },
      { label: "3D Mats", path: "/products/autoform-car-mats" },
    ]
  },
  { key: "AUDIO_SECURITY", label: "Audio & Security", path: "/products?vid=2&pcid=13" },
  { key: "STORE_LOCATOR", label: "Store Locator" },
  { key: "FRANCHISE", label: "Franchise" },
  { key: "CONTACT_US", label: "Contact Us" }
];

export const CONTACT_INFO = {
  phone1: "+91 9278411411/",
  phone2: "+91 120 4247861",
  email: "marketing@autoformindia.com"
}