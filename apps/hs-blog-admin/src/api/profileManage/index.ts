interface Skills {
  name: string;
  items: { name: string }[];
}

interface Projects {
  name: string;
  description: string;
  tech: string[];
  link: string;
}

interface Contacts {
  platform: string;
  link: string;
  icon: string;
}

export interface Seo {
  title: string;
  description: string;
  keywords: string;
  ogDescription: string;
  twitterDescription: string;
}

export interface ProfileInfoRes {
  name: string;
  title: string;
  description: string;
  bio: string[];
  skills: Skills[];
  projects: Projects[];
  contacts: Contacts[];
  seo: Seo;
}

export interface SaveProfileInfoReq extends ProfileInfoRes {}

/**
 * 获取关于信息
 */
export async function getProfileInfo() {
  return await request.get<ProfileInfoRes>("/user/personal-profile-info");
}

/**
 * 保存关于信息
 */
export async function saveProfileInfo(params: SaveProfileInfoReq) {
  return await request.put<null>("/user/personal-profile-info", params);
}
