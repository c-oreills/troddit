import { useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/dist/client/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { numToString, secondsToDate } from "../../../lib/utils";
import { useMainContext } from "../../MainContext";
import SubButton from "../SubButton";
import SubOptButton from "../SubOptButton";
import { BsBoxArrowInUpRight } from "react-icons/bs";

const SubCard = ({
  data,
  link = true,
  tall = false,
  subInfo = undefined,
  currMulti = undefined,
  subArray = undefined,
  openDescription = undefined,
}) => {
  const context: any = useMainContext();
  const [thumbURL, setThumbURL] = useState("");
  const [subBanner, setBanner] = useState<any>({});
  const [hideNSFW, setHideNSFW] = useState(false);
  const [session, sessloading] = useSession();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);

    let currSubInfo = data?.data;
    if (data.kind === "t2" && data?.data?.subreddit)
      currSubInfo = data.data.subreddit;
    let bannerurl = "";
    if (currSubInfo?.banner_background_image?.length > 0) {
      bannerurl = currSubInfo?.banner_background_image?.replaceAll("amp;", "");
    } else if (currSubInfo?.banner_img?.length > 0) {
      bannerurl = currSubInfo?.banner_img?.replaceAll("amp;", "");
    }
    setBanner({
      backgroundImage: `url("${bannerurl}")`,
      backgroundColor:
        currSubInfo?.banner_background_color?.length > 1
          ? currSubInfo.banner_background_color
          : currSubInfo?.key_color?.length > 1
          ? currSubInfo.key_color
          : "",
    });

    if (currSubInfo?.icon_url) {
      setThumbURL(currSubInfo.icon_url);
    } else {
      currSubInfo?.community_icon?.length > 1
        ? setThumbURL(currSubInfo?.community_icon?.replaceAll("amp;", ""))
        : currSubInfo?.icon_img?.length > 1
        ? setThumbURL(currSubInfo?.icon_img)
        : setThumbURL("");
      // : currSubInfo?.header_img?.length > 1 &&
      //   setThumbURL(currSubInfo?.header_img);
    }
    //data?.kind === 't2' || data?.kind === 't5' && 
    setLoading(false);
    return () => {
      setThumbURL("");
      setBanner({});
      setLoading(true);
    };
  }, [data, link]);

  useEffect(() => {
    if (data?.data?.over18 && context.nsfw !== "true") {
      setHideNSFW(true);
    } else {
      setHideNSFW(false);
    }
  }, [context.nsfw, data]);

  const main = (
    <div
      className={
        "relative  transition-colors bg-contain border shadow-md bg-lightPost    dark:bg-darkBG   " +
        (context?.cardStyle === "row1" ||
        context?.cardStyle === "card2" ||
        context?.mediaOnly
          ? "  "
          : tall
          ? "  "
          : " rounded-md ") +
        (tall
          ? " border-transparent dark:border-b-trueGray-700 border-b-gray-300 "
          : " group dark:border-trueGray-700 border-gray-300   dark:hover:border-trueGray-500 hover:shadow-2xl hover:bg-lightPostHover dark:hover:bg-darkPostHover hover:cursor-pointer hover:border-gray-400")
      }
    >
      <div
        className={
          ` absolute  w-full  bg-cover bg-center bg-blue-400 dark:bg-red-800 ` +
          (context?.cardStyle === "row1" ||
          context?.cardStyle === "card2" ||
          context?.mediaOnly
            ? "  "
            : tall
            ? " "
            : " rounded-t-md ") +
          (tall ? " h-[121px] border-b " : " h-16")
        }
        style={hideNSFW ? {} : subBanner}
      ></div>

      <div
        className={
          "flex flex-col my-2 " +
          (tall ? "h-52 md:h-40 mx-6 " : " h-[8.75rem] md:h-24 mx-2 ")
        }
      >
        <div className={"flex flex-row " + (tall ? " mt-[4.5rem] " : " mt-6")}>
          <div
            className={
              "z-20 flex-none  border-2 hover:cursor-pointer rounded-full dark:bg-darkBG bg-lightPost" +
              (tall ? " -mt-2 w-24 h-24 " : " w-16 h-16")
            }
            onClick={() => {
              !link && openDescription() //context.setForceRefresh((p) => p + 1);
            }}
          >
            {thumbURL?.includes("https") && !hideNSFW ? (
              <Image
                src={thumbURL}
                alt=""
                height={data?.data?.icon_size?.[0] ?? 256}
                width={data?.data?.icon_size?.[1] ?? 256}
                unoptimized={true}
                objectFit="cover"
                className={"rounded-full "}
              />
            ) : (
              <div
                className={
                  "rounded-full bg-blue-700" +
                  " w-full h-full  text-lightText text-6xl overflow-hidden items-center justify-center flex"
                }
              >
                {data?.kind === "t2" ? "u/" : "r/"}
              </div>
            )}
          </div>
          <div className="flex flex-col ">
            <div
              className={
                "z-10 flex flex-row   pl-5 pr-2  -ml-3.5 space-x-2 rounded-tr-md pl-auto dark:bg-darkBG bg-lightPost " +
                (tall
                  ? " border-t border-r pt-[6px] pb-[-3px] items-end mt-[10px] "
                  : " dark:group-hover:bg-darkPostHover items-baseline group-hover:bg-lightPostHover pt-0.5 mt-2")
              }
            >
              {(loading) ? (
                <>
                  <div className="h-6 w-52"></div>
                </>
              ) : (
                <>
                  <h1 className={"font-semibold  hover:cursor-pointer hover:underline group-hover:underline" + (tall ? " " : " ")}
                  onClick={() => {
                    !link && context.setForceRefresh((p) => p + 1);
                  }}
                  >
                    {data?.kind === "t2"
                      ? `u/${data?.data?.name}`
                      : data?.data?.display_name_prefixed ?? <div className="w-16">r/</div>}
                      
                  </h1>
                  {!link && (data?.data?.url || data?.data?.subreddit?.url) && 
                      <a
                      href={`https://www.reddit.com${data?.data?.url ?? data?.data?.subreddit?.url}`}
                      target={"_blank"}
                      rel="noreferrer"
                      className="mb-3 ml-2 rounded dark:hover:bg-darkPostHover hover:bg-lightHighlight"
                    >
                        <BsBoxArrowInUpRight className="w-3 h-3 -ml-1" />
                      
                    </a>
                      }
                  <h1 className="text-xs font-semibold pb-0.5">
                    {data?.kind === "t2"
                      ? `${numToString(
                        data?.data?.comment_karma ??
                          0 + data?.data?.link_karma ??
                          0,
                        1000
                      )} karma` 
                      : `${data?.data?.subscribers?.toLocaleString(
                        "en-US"
                      ) ?? "               "} members` }
                  </h1>
                  {!link && data?.data?.active_user_count && <span className="text-xs font-semibold opacity-70 pb-0.5">{data?.data?.active_user_count?.toLocaleString(
                            "en-US"
                          )} here</span>}
                  {(data?.data?.over18 || data?.data?.subreddit?.over_18) && (
                    <>
                      <span className="text-xs text-red-400 text-color dark:text-red-700">
                        NSFW
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={
            "flex flex-row  " +
            (tall ? " ml-[6.5rem] -mt-2 md:-mt-4 " : " pl-5 ml-[3.25rem]")
          }
        >
          <h1 className="h-8 -mt-6 overflow-x-hidden overflow-y-scroll text-xs scrollbar-none">
            {data?.data?.public_description}
          </h1>
          <div
            className={
              "relative hidden md:flex  flex-row mb-auto ml-auto -mt-6 space-x-1 " +
              (tall ? " " : " ")
            }
          >
            <SubButton
              sub={
                data?.kind == "t5"
                  ? session
                    ? data?.data?.name
                    : data?.data?.display_name
                  : session
                  ? data?.data?.subreddit?.name
                  : data?.data?.subreddit?.display_name
              }
              userMode={data?.kind === "t2"}
            />
            {data?.kind !== "t2" && !link && (
              <SubOptButton
                subInfo={subInfo}
                currMulti={currMulti}
                subArray={subArray}
                openDescription={openDescription}
              />
            )}
          </div>
        </div>
        <div className="z-20 flex flex-row mt-2 ml-auto space-x-1 md:hidden">
          <SubButton
            sub={
              data?.kind == "t5"
                ? session
                  ? data?.data?.name
                  : data?.data?.display_name
                : session
                ? data?.data?.subreddit?.name
                : data?.data?.subreddit?.display_name
            }
            userMode={data?.kind === "t2"}
          />
          {data?.kind === "t5" && !link && subInfo && currMulti && subArray && (
            <SubOptButton
              subInfo={subInfo}
              currMulti={currMulti}
              subArray={subArray}
            />
          )}
        </div>
      </div>
    </div>
  );

  if (link)
    return (
      <Link
        href={
          data?.kind === "t5"
            ? data?.data?.url
            : data?.data?.subreddit?.url?.replace("/user/", "/u/")
        }
      >
        <a>{main}</a>
      </Link>
    );

  return <>{main}</>;
};

export default SubCard;