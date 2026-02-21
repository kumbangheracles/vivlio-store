"use client";
import { ErrorHandler } from "@/helpers/handleError";
import { useAuth } from "@/hooks/useAuth";
import myAxios from "@/libs/myAxios";
import { CategoryProps } from "@/types/category.types";
import { UserProperties } from "@/types/user.type";
import { Button, message, Modal, ModalProps } from "antd";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface PropTypes extends ModalProps {
  dataCategory?: CategoryProps[];
  dataUser?: UserProperties;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const ModalCategoryProps = ({
  dataCategory,
  dataUser,
  isOpen,
  setIsOpen,
  ...props
}: PropTypes) => {
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAuth();
  const router = useRouter();

  const [selected, setSelected] = useState<string[]>([]);
  const defaultCategoryIds =
    dataUser?.category_preference?.map((item) => item.categoryId) || [];

  const sortedSelected = [...selected].sort();
  const sortedDefault = [...defaultCategoryIds].sort();

  const isSameCategory =
    sortedSelected.length === sortedDefault.length &&
    sortedSelected.every((id, index) => id === sortedDefault[index]);

  const handleSubmitData = async () => {
    let payload: UserProperties = {};

    payload.category_preference = dataCategory?.filter((item) =>
      selected.includes(item.categoryId),
    );

    try {
      setLoading(true);
      await myAxios.patch(`/users/${auth?.user?.id}`, payload);

      message.success("Success update category preference.");
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
      router.refresh();
      setIsOpen?.(false);
    }
  };

  useEffect(() => {
    if (dataUser?.category_preference && selected.length === 0) {
      setSelected(dataUser.category_preference.map((item) => item.categoryId));
    }
  }, [dataUser]);
  return (
    <Modal {...props}>
      <div className="p-4">
        <h4 className="font-semibold text-center text-[18px]">
          Category Preference
        </h4>

        <p className="text-sm text-gray-500 my-4">
          Select maximum 5 category which you prefered.
        </p>
        <div className="flex flex-wrap justify-center gap-1 h-[150px] max-h-[500px] overflow-y-scroll ">
          {dataCategory?.map((item) => (
            <h4
              key={item?.categoryId}
              onClick={() => {
                setSelected((prev) => {
                  const isSelected = prev.includes(item.categoryId);

                  if (isSelected) {
                    return prev.filter((id) => id !== item.categoryId);
                  }

                  if (prev.length >= 5) {
                    return prev;
                  }

                  return [...prev, item.categoryId];
                });
              }}
              className={`p-3 tracking-wider text-sm max-h-[50px] flex justify-center items-center cursor-pointer  min-w-[90px] rounded-2xl text-[11px] sm:text-sm ${selected.includes(item.categoryId) ? "bg-sky-200" : "bg-gray-100"}`}
            >
              {item?.name}
            </h4>
          ))}
        </div>
        <Button
          loading={loading}
          disabled={isSameCategory}
          type="primary"
          style={{ width: "100%", marginTop: "17px", minHeight: 38 }}
          onClick={() => handleSubmitData()}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default ModalCategoryProps;
