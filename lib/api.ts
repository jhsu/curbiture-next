import fs from "fs";
import { join } from "path";
import remark from "remark";
import html from "remark-html";

const postsDirectory = join(process.cwd(), "_posts");

export async function getPostContent(postName: string) {
  const fullPath = join(postsDirectory, `${postName}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const content = await remark().use(html).process(fileContents);
  return content.toString();
}
