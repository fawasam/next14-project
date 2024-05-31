"use client";
import React, { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";
import { toast } from "@/components/ui/use-toast";
const GlobalResult = () => {
  const searchParams = useSearchParams();

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);
      setIsLoading(true);

      try {
        const res: any = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        console.log(error);
        toast({
          title: `something went wrong please try again`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);
  return (
    <div className="shadow-sm absolute top-full z-10 mt-3 h-auto w-full rounded-lg bg-light-800 py-5 dark:bg-dark-400">
      <p className="text-dark400_light900 paragraph-semibold px-5">
        <GlobalFilters />
      </p>
      <div className="my-5 h-px bg-light-700/50 dark:bg-dark-500/50">
        <div className="space-y-5">
          <p className="text-dark400_light900 paragraph-semibold px-5">
            Top Match
          </p>

          {isLoading ? (
            <div className="flex-center flex-col px-5">
              <ReloadIcon className="animate-spin my-2 size-10 text-primary-500" />
              <p className="text-dark200_light800 body-regular">
                Browsing the entire database
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {result.length > 0 ? (
                result.map((item: any, i: number) => (
                  <Link
                    href={renderLink(item.type, item.id)}
                    key={item.type + item.id + i}
                    className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
                  >
                    <Image
                      src="/assets/icons/tag.svg"
                      alt="tags"
                      width={18}
                      height={18}
                      className="invert-colors mt-1 object-contain"
                    />
                    <div className="flex flex-col">
                      <p className="body-medium text-dark200_light800 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="small-medium text-dark400_light500 mt-1 line-clamp-1 font-bold capitalize">
                        {item.type}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex-center flex-col px-5">
                  <p className="text-dark200_light800 body-regular px-5 py-2.5">
                    Oops, no results found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalResult;

const renderLink = (type: string, id: string) => {
  switch (type) {
    case "question":
      return `/question/${id}`;
    case "user":
      return `/profile/${id}`;
    case "answer":
      return `/question/${id}`;
    case "tag":
      return `/tag/${id}`;
    default:
      return `/`;
  }
};
