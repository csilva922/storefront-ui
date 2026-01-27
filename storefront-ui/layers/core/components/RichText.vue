<script setup lang="ts">
import { computed } from "vue";

type AnyObj = Record<string, any>;

export interface RichTextNode {
  type?: string;
  format?: number | string;
  children?: RichTextNode[];
  text?: string;
  root?: { children: RichTextNode[] };

  tag?: string | number;
  level?: number;

  url?: string;

  listType?: string;
  checked?: boolean;

  value?: any;
  relationTo?: string;

  fields?: AnyObj;

  [key: string]: unknown;
}

const props = defineProps<{
  content?: RichTextNode | null;
  payloadURL?: string;
}>();

const escapeHTML = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const toAbs = (url: string) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = String(props.payloadURL || "").replace(/\/$/, "");
  if (!base) return url;
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
};

const F = {
  bold: 1,
  italic: 2,
  strikethrough: 4,
  underline: 8,
  code: 16,
  subscript: 32,
  superscript: 64,
};

const applyTextFormat = (raw: string, format?: number | string) => {
  let out = escapeHTML(raw);

  if (typeof format === "string") {
    if (format.includes("code")) out = `<code>${out}</code>`;
    if (format.includes("bold")) out = `<strong>${out}</strong>`;
    if (format.includes("italic")) out = `<em>${out}</em>`;
    if (format.includes("underline")) out = `<u>${out}</u>`;
    if (format.includes("strikethrough")) out = `<s>${out}</s>`;
    return out;
  }

  const f = typeof format === "number" ? format : 0;

  if (f & F.code) out = `<code>${out}</code>`;
  if (f & F.bold) out = `<strong>${out}</strong>`;
  if (f & F.italic) out = `<em>${out}</em>`;
  if (f & F.underline) out = `<u>${out}</u>`;
  if (f & F.strikethrough) out = `<s>${out}</s>`;
  if (f & F.subscript) out = `<sub>${out}</sub>`;
  if (f & F.superscript) out = `<sup>${out}</sup>`;

  return out;
};

const renderChildren = (node: RichTextNode) =>
  (node.children || []).map(renderNode).join("");

const clampHeading = (n: number) => Math.min(6, Math.max(1, n));

const resolveHeadingTag = (node: AnyObj): string => {
  const tag = node.tag ?? node.fields?.tag;
  const level = node.level ?? node.fields?.level;

  if (typeof tag === "string" && /^h[1-6]$/.test(tag)) return tag;
  if (typeof tag === "number") return `h${clampHeading(tag)}`;
  if (typeof level === "number") return `h${clampHeading(level)}`;

  if (typeof node.format === "number" && node.format >= 1 && node.format <= 6) {
    return `h${clampHeading(node.format)}`;
  }

  return "h2";
};

const resolveLinkURL = (node: AnyObj): string => {
  const u =
    node.url ??
    node.fields?.url ??
    node.fields?.link?.url ??
    node.fields?.linkURL ??
    "";

  return String(u || "");
};

const renderUpload = (node: AnyObj) => {
  const v = node.value ?? node.fields?.value;

  const url =
    typeof v === "object"
      ? (v?.url || v?.sizes?.card?.url || v?.sizes?.tablet?.url || v?.sizes?.mobile?.url)
      : null;

  const alt = typeof v === "object" ? (v?.alt || v?.filename || "") : "";

  if (url) {
    return `<img src="${escapeHTML(toAbs(String(url)))}" alt="${escapeHTML(String(alt))}" />`;
  }

  return "";
};

const renderRelationship = (node: AnyObj) => {
  const relationTo = node.relationTo ?? node.fields?.relationTo ?? "";
  const value = node.value ?? node.fields?.value;

  if (typeof value === "object" && value) {
    const label =
      value.title ?? value.name ?? value.slug ?? value.id ?? value._id ?? "Relationship";
    return `<span class="rt-relationship" data-relation="${escapeHTML(
      String(relationTo)
    )}">${escapeHTML(String(label))}</span>`;
  }

  if (typeof value === "string" || typeof value === "number") {
    return `<span class="rt-relationship" data-relation="${escapeHTML(
      String(relationTo)
    )}">${escapeHTML(String(value))}</span>`;
  }

  return "";
};

const renderList = (node: AnyObj) => {
  const listType = node.listType ?? node.fields?.listType ?? "";
  const tagFromNode = node.tag ?? node.fields?.tag;

  const isCheck = listType === "check" || listType === "checklist" || listType === "checkList";
  const tag =
    typeof tagFromNode === "string" && (tagFromNode === "ul" || tagFromNode === "ol")
      ? tagFromNode
      : listType === "number"
      ? "ol"
      : "ul";

  if (isCheck) {
    return `<ul class="rt-checklist">${renderChildren(node)}</ul>`;
  }

  return `<${tag}>${renderChildren(node)}</${tag}>`;
};

const renderListItem = (node: AnyObj) => {
  const children = renderChildren(node);
  const checked = Boolean(node.checked ?? node.fields?.checked);
  const parentListType = node.parentListType ?? node.fields?.parentListType;

  const isCheck =
    parentListType === "check" ||
    parentListType === "checklist" ||
    parentListType === "checkList" ||
    node.checked !== undefined;

  if (isCheck) {
    return `<li class="rt-checkitem"><input type="checkbox" ${
      checked ? "checked" : ""
    } disabled /> <span>${children}</span></li>`;
  }

  return `<li>${children}</li>`;
};

const typeKey = (t?: unknown) => String(t || "").toLowerCase();

const renderNode = (node?: RichTextNode | null): string => {
  if (!node) return "";

  if (node.root?.children) return node.root.children.map(renderNode).join("");

  const t = typeKey(node.type);

  if (t === "root") return renderChildren(node);

  if (typeof node.text === "string") return applyTextFormat(node.text, node.format);

  switch (t) {
    case "paragraph":
      return `<p>${renderChildren(node)}</p>`;

    case "heading": {
      const tag = resolveHeadingTag(node as AnyObj);
      return `<${tag}>${renderChildren(node)}</${tag}>`;
    }

    case "list":
      return renderList(node as AnyObj);

    case "listitem":
    case "list-item":
    case "list_item":
      return renderListItem(node as AnyObj);

    case "link": {
      const url = resolveLinkURL(node as AnyObj);
      return `<a href="${escapeHTML(url)}">${renderChildren(node)}</a>`;
    }

    case "linebreak":
      return "<br />";

    case "horizontalrule":
    case "horizontal-rule":
    case "hr":
      return "<hr />";

    case "blockquote":
    case "quote":
      return `<blockquote>${renderChildren(node)}</blockquote>`;

    case "upload":
      return renderUpload(node as AnyObj);

    case "relationship":
      return renderRelationship(node as AnyObj);

    default:
      if ((node as AnyObj).children?.length) return renderChildren(node);
      return "";
  }
};

const htmlContent = computed(() => {
  if (!props.content) return "";
  return renderNode(props.content);
});
</script>

<template>
  <div class="rich-text" v-html="htmlContent"></div>
</template>

<style scoped>
.rich-text :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

.rich-text :deep(p) {
  margin: 0.75rem 0;
}

.rich-text :deep(ul) {
  list-style: disc;
  padding-left: 1.25rem;
  margin: 0.75rem 0;
}

.rich-text :deep(ol) {
  list-style: decimal;
  padding-left: 1.25rem;
  margin: 0.75rem 0;
}

.rich-text :deep(li) {
  margin: 0.25rem 0;
}

.rich-text :deep(a) {
  text-decoration: underline;
}

.rich-text :deep(hr) {
  margin: 1.25rem 0;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
}

.rich-text :deep(blockquote) {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-left: 3px solid rgba(0, 0, 0, 0.25);
  opacity: 0.9;
}

.rich-text :deep(h1) {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 700;
  margin: 1.25rem 0;
}

.rich-text :deep(h2) {
  font-size: 1.75rem;
  line-height: 1.25;
  font-weight: 700;
  margin: 1.15rem 0;
}

.rich-text :deep(h3) {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 700;
  margin: 1rem 0;
}

.rich-text :deep(h4) {
  font-size: 1.25rem;
  line-height: 1.35;
  font-weight: 600;
  margin: 0.9rem 0;
}

.rich-text :deep(h5) {
  font-size: 1.125rem;
  line-height: 1.4;
  font-weight: 600;
  margin: 0.8rem 0;
}

.rich-text :deep(h6) {
  font-size: 1rem;
  line-height: 1.45;
  font-weight: 600;
  margin: 0.75rem 0;
}

.rich-text :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 0.95em;
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
}

.rich-text :deep(.rt-checklist) {
  list-style: none;
  padding-left: 0;
}

.rich-text :deep(.rt-checkitem) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0.4rem 0;
}

.rich-text :deep(.rt-checkitem input) {
  margin-top: 0.25rem;
}

.rich-text :deep(.rt-relationship) {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  border-radius: 0.35rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 0.9em;
}
</style>
