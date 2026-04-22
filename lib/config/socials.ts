import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
} from "@tabler/icons-react";

export const FESTIVAL_NAME = "Chef's Kiss Festival";
export const INSTAGRAM_HANDLE = "@chefskiss.cy";
export const INSTAGRAM_URL = "https://instagram.com/chefskiss.cy/";

export const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: INSTAGRAM_URL,
    Icon: IconBrandInstagram,
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@chefskiss.cy",
    Icon: IconBrandTiktok,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/profile.php?id=61575561244802",
    Icon: IconBrandFacebook,
  },
] as const;
