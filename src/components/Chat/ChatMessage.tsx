import { Message } from "@/lib/store/messageStore";
import { useUser } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  message: Message;
  className?: string;
  position: string;
};

export const ChatMessage = ({ message, className, position }: Props) => {
  if (!message) return null;

  const user = useUser((state) => state.user);

  const parsedDate = new Date(message.created_at);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(parsedDate);

  return (
    <div
      className={cn(
        "group flex items-center gap-3",
        position === "first" && "pt-2",
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
              position === "last" || position === "" ? "block" : "hidden",
              message.user_id === user?.id && "hidden",
            )}
          />
        </div>
      </div>
      <div className={cn("flex w-full items-center justify-between gap-3")}>
        <div
          className={cn(
            "w-auto max-w-[calc(90%-4rem)] rounded-2xl px-2.5 py-2",
            message.user_id === user?.id
              ? "ml-auto self-end bg-indigo-500"
              : "bg-neutral-700",
            message.user_id === user?.id && position === "first"
              ? "rounded-br"
              : message.user_id === user?.id && position === "middle"
                ? "rounded-r"
                : message.user_id === user?.id &&
                  position === "last" &&
                  "rounded-tr",

            message.user_id !== user?.id && position === "first"
              ? "rounded-bl"
              : message.user_id !== user?.id && position === "middle"
                ? "rounded-l"
                : message.user_id !== user?.id &&
                  position === "last" &&
                  "rounded-tl",
          )}
        >
          <p>{message.content}</p>
        </div>
        <span className="hidden text-[.65rem] leading-none opacity-40 group-hover:block">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};
