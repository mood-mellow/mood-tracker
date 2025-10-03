import Image from "next/image";

export function MoodSelector() {
  return (
    <div
      className="flex aspect-[526/74] w-full max-w-[526px] flex-row items-center justify-between bg-contain bg-no-repeat px-[clamp(4px,2vw,10.52px)] pb-[1%]"
      style={{ backgroundImage: "url(/moods_container.svg)" }}
    >
      <div className="relative aspect-square h-[70%]">
        <Image
          src="emojis/pouting_face.svg"
          fill
          className="object-contain"
          alt="pouting face"
        />
      </div>
      <div className="relative aspect-square h-[70%]">
        <Image
          src="emojis/worried_face.svg"
          fill
          className="object-contain"
          alt="worried face"
        />
      </div>
      <div className="relative aspect-square h-[70%]">
        <Image
          src="emojis/slightly_frowning_face.svg"
          fill
          className="object-contain"
          alt="slightly frowning face"
        />
      </div>
      <div className="relative aspect-square h-[70%]">
        <Image
          src="emojis/neutral_face.svg"
          fill
          className="object-contain"
          alt="neutral face"
        />
      </div>
      <div className="relative aspect-square h-[70%]">
        <Image
          src="emojis/slightly_smiling_face.svg"
          fill
          className="object-contain"
          alt="slightly smiling face"
        />
      </div>
      <div className="relative aspect-square h-[70%]">
        <Image
          src="emojis/smiling_face_smiling_eyes.svg"
          fill
          className="object-contain"
          alt="smiling face with smiling eyes"
        />
      </div>
      <div className="relative aspect-square h-[70%]">
        <Image
          src="emojis/smiling_face_hearts.svg"
          fill
          className="object-contain"
          alt="smiling face with hearts"
        />
      </div>
      {/*<Image
        src="emojis/worried_face.svg"
        height={40}
        width={40}
        alt="worried face"
      />
      <Image
        src="emojis/slightly_frowning_face.svg"
        height={40}
        width={40}
        alt="slightly frowning face"
      />
      <Image
        src="emojis/neutral_face.svg"
        height={40}
        width={40}
        alt="neutral face"
      />
      <Image
        src="emojis/slightly_smiling_face.svg"
        height={40}
        width={40}
        alt="slightly smiling face"
      />
      <Image
        src="emojis/smiling_face_smiling_eyes.svg"
        height={40}
        width={40}
        alt="smiling face with smiling eyes"
      />
      <Image
        src="emojis/smiling_face_hearts.svg"
        height={40}
        width={40}
        alt="smiling face with hearts"
      />*/}
    </div>
  );
}
