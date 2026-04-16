export interface Scholar {
  id: string;
  name: string;
  field: string;
  slug: string;
  color: string;
  description: string;
}

export const SCHOLARS: Record<string, Scholar> = {
  tran_ngoc_them: {
    id: "tran_ngoc_them",
    name: "Trần Ngọc Thêm",
    field: "Triết học hệ thống",
    slug: "tran-ngoc-them",
    color: "#7F77DD",
    description:
      "Giáo sư triết học văn hóa, tác giả 'Tìm về bản sắc văn hóa Việt Nam' và 'Cơ sở văn hóa Việt Nam'. Ông phân tích văn hóa Việt qua lăng kính đối lập nông nghiệp – du mục, chứng minh Âm Dương và Ngũ Hành có nguồn gốc phương Nam.",
  },
  tran_quoc_vuong: {
    id: "tran_quoc_vuong",
    name: "Trần Quốc Vượng",
    field: "Khảo cổ học",
    slug: "tran-quoc-vuong",
    color: "#639922",
    description:
      "Giáo sư khảo cổ học và nhân học, tác giả 'Cơ sở văn hóa Việt Nam'. Ông tiếp cận văn hóa từ bằng chứng vật chất — di chỉ, hiện vật, sinh thái — để chứng minh cội nguồn bản địa Đông Nam Á của văn hóa Việt.",
  },
  cao_xuan_hao: {
    id: "cao_xuan_hao",
    name: "Cao Xuân Hạo",
    field: "Ngôn ngữ học",
    slug: "cao-xuan-hao",
    color: "#1D9E75",
    description:
      "Giáo sư ngôn ngữ học, tác giả 'Tiếng Việt - Văn Việt - Người Việt'. Ông chứng minh cấu trúc Đề-Thuyết là linh hồn tiếng Việt, phản bác việc áp đặt ngữ pháp Chủ-Vị phương Tây.",
  },
  ngo_duc_thinh: {
    id: "ngo_duc_thinh",
    name: "Ngô Đức Thịnh",
    field: "Tín ngưỡng / Dân tộc học",
    slug: "ngo-duc-thinh",
    color: "#EF9F27",
    description:
      "Giáo sư dân tộc học, tác giả 'Đạo Mẫu Việt Nam'. Ông nghiên cứu hệ thống tín ngưỡng thờ Mẫu — từ Nữ thần nguyên thủy đến Tứ Phủ — chứng minh đây là tôn giáo dân gian có hệ thống, không phải mê tín.",
  },
} as const;

export const SCHOLAR_IDS = Object.keys(SCHOLARS) as Array<keyof typeof SCHOLARS>;

export function getScholarById(id: string): Scholar | undefined {
  return SCHOLARS[id];
}

export function getScholarBySlug(slug: string): Scholar | undefined {
  return Object.values(SCHOLARS).find((s) => s.slug === slug);
}
