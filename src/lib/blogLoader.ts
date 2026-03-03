interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags?: string[];
  cover?: string;
  content: string;
}

const blogModules = import.meta.glob("../content/*.md", {
  eager: true,
  as: "raw",
});

function parseFrontmatter(raw: string) {
  const frontmatterRegex = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]*/;
  const match = raw.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: raw };
  }

  const frontmatter = match[1];
  const content = raw.replace(frontmatterRegex, "").trim();

  const data: any = {};

  frontmatter.split(/\r?\n/).forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key) return;

    const value = rest.join(":").trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key.trim()] = value
        .replace(/[\[\]"]/g, "")
        .split(",")
        .map((v) => v.trim());
    } else {
      data[key.trim()] = value.replace(/"/g, "");
    }
  });

  return { data, content };
}

export const getAllBlogs = (): BlogMeta[] => {
  const blogs: BlogMeta[] = [];

  for (const path in blogModules) {
    const raw = blogModules[path] as string;

    const { data, content } = parseFrontmatter(raw);

    const slug =
      path.split("/").pop()?.replace(".md", "") || "";

    blogs.push({
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      tags: data.tags || [],
      cover: data.cover || "",
      content,
    });
  }

  return blogs.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const getBlogBySlug = (slug: string) => {
  return getAllBlogs().find((blog) => blog.slug === slug);
};