import {
  generateFAQPageSchema,
  generateHowToSchema,
  generateFortuneSchema,
  generateCreativeWorkSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo-config-extended";

interface StructuredDataProps {
  type: "faq" | "howto" | "fortune" | "creativeWork" | "organization" | "website";
  data?: Record<string, unknown>;
}

/**
 * Structured Data (JSON-LD) component for unse
 *
 * FAQ, HowTo, 운세 정보 등을 위한
 * 구조화된 데이터를 렌더링합니다.
 */
export default function StructuredData({
  type,
  data,
}: StructuredDataProps) {
  let schema: Record<string, unknown> | null = null;

  switch (type) {
    case "faq":
      schema = generateFAQPageSchema(
        data?.faqs as Parameters<typeof generateFAQPageSchema>[0]
      );
      break;
    case "howto":
      schema = generateHowToSchema(
        data as Parameters<typeof generateHowToSchema>[0]
      );
      break;
    case "fortune":
      schema = generateFortuneSchema(
        data as Parameters<typeof generateFortuneSchema>[0]
      );
      break;
    case "creativeWork":
      schema = generateCreativeWorkSchema(
        data as Parameters<typeof generateCreativeWorkSchema>[0]
      );
      break;
    case "organization":
      schema = organizationSchema;
      break;
    case "website":
      schema = websiteSchema;
      break;
    default:
      return null;
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      suppressHydrationWarning
    />
  );
}
