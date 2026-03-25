import Image from "next/image";

const moods = [
  {
    src: "/emojis/pouting_face.svg",
    alt: "pouting face",
    value: "furious",
    color: "border-[#F8312F]",
  },
  {
    src: "/emojis/worried_face.svg",
    alt: "worried face",
    value: "fearful",
    color: "border-[#15DE2D]",
  },
  {
    src: "/emojis/slightly_frowning_face.svg",
    alt: "slightly frowning face",
    value: "sad",
    color: "border-[#2D9EFF]",
  },
  {
    src: "/emojis/neutral_face.svg",
    alt: "neutral face",
    value: "neutral",
    color: "border-[#FFB02E]",
  },
  {
    src: "/emojis/slightly_smiling_face.svg",
    alt: "slightly smiling face",
    value: "good",
    color: "border-[#F7E187]",
  },
  {
    src: "/emojis/smiling_face_smiling_eyes.svg",
    alt: "smiling face with smiling eyes",
    value: "great",
    color: "border-[#FBA888]",
  },
  {
    src: "/emojis/smiling_face_hearts.svg",
    alt: "smiling face with hearts",
    value: "loving",
    color: "border-[#FF8EF7]",
  },
];

type MoodSelectorProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div
      className="flex aspect-[526/74] w-full max-w-[526px] flex-row items-center justify-between bg-contain bg-no-repeat px-[clamp(4px,2vw,8px)] pb-[1%]"
      style={{ backgroundImage: "url(/moods_container.svg)" }}
    >
      {moods.map((mood, idx) => {
        const isSelected = value === mood.value;
        return (
          <button
            type="button"
            onClick={() => onChange(mood.value)}
            key={idx}
            className={`relative aspect-square h-[70%] cursor-pointer rounded-full border-3 transition-colors duration-300 ${
              isSelected ? mood.color : "border-transparent"
            }`}
          >
            <Image
              src={mood.src}
              fill
              className="object-contain"
              alt={mood.alt}
            />
          </button>
        );
      })}
    </div>
  );
}
