import Image from "next/image";

type Props = {
  name: string;
  avatarVersion: string | null;
  size?: "sm" | "lg";
};

export default function UserAvatar({
  name,
  avatarVersion,
  size = "sm",
}: Props) {
  const large = size === "lg";
  const pixels = large ? 80 : 40;

  const sizeClass = large
    ? "w-20 h-20 text-2xl"
    : "w-10 h-10 text-base";

  const initial =
    name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden shrink-0 bg-blue-600 text-white flex items-center justify-center font-bold`}
    >
      {avatarVersion ? (
        <Image
          unoptimized
          src={`/api/profile/avatar?v=${avatarVersion}`}
          alt={`${name} profile picture`}
          width={pixels}
          height={pixels}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}