import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: user.clerkId });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      // href="/"
      className=" w-full border border-red-300 max-xs:min-w-full xs:w-[260px]"
    >
      <article>
        <Image
          src={user?.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full flex items-center justify-center mx-auto"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user?.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user?.username}
          </p>
        </div>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2 justify-center">
              {interactedTags.map((tag, i) => (
                <RenderTag key={i} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
