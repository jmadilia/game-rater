import Image from "next/image";

interface AvatarProps {
  url: string | null;
  username: string;
  size?: number;
}

export default function Avatar({ url, username, size = 40 }: AvatarProps) {
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <div
      className="rounded-full overflow-hidden bg-retro-accent dark:bg-dark-accent flex items-center justify-center"
      style={{ width: `${size}px`, height: `${size}px` }}>
      {url ? (
        <Image
          src={url || "/placeholder.svg"}
          alt={username}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="h-full w-full flex items-center justify-center text-white font-bold"
          style={{ fontSize: `${size / 2}px` }}>
          {firstLetter}
        </div>
      )}
    </div>
  );
}
