import { Message } from "@/lib/store/messageStore";
import { useUser } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  message: Message;
  className?: string;
  position: string;
  userId: string;
};

export const ChatMessage = ({ message, position, userId }: Props) => {
  if (!message) return null;

  const parsedDate = new Date(message.created_at);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(parsedDate);

  const isOwnMessage = message.user_id === userId;

  return (
    <div
      className={cn(
        "group flex items-center gap-3",
        position === "first" || position === "single" ? "pt-3" : "",
      )}
    >
      <div className="flex items-center gap-3 self-end">
        <div className="size-6 overflow-hidden rounded-full">
          <Image
            src={message.users?.avatar_url!}
            alt={`Message by user ${message.users?.display_name}`}
            width={128}
            height={128}
            className={cn(
              position === "last" || position === "single" ? "block" : "hidden",
              isOwnMessage && "hidden",
            )}
          />
        </div>
      </div>
      <div className={cn("flex w-full items-center justify-between gap-3")}>
        <div
          className={cn(
            "w-auto max-w-[calc(100%-3rem)] rounded-2xl px-2.5 py-2",
            isOwnMessage ? "ml-auto self-end bg-indigo-500" : "bg-neutral-700",
            isOwnMessage && position === "first"
              ? "rounded-br"
              : isOwnMessage && position === "middle"
                ? "rounded-r"
                : isOwnMessage && position === "last" && "rounded-tr",

            !isOwnMessage && position === "first"
              ? "rounded-bl"
              : !isOwnMessage && position === "middle"
                ? "rounded-l"
                : !isOwnMessage && position === "last" && "rounded-tl",
          )}
        >
          <p>{message.content}</p>
        </div>
        {/* <span className="hidden text-[.65rem] leading-none opacity-40 group-hover:block">
          {formattedDate}
        </span> */}
      </div>
    </div>
  );
};
