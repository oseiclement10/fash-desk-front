import { notification } from "antd";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { MutationFunction } from "@tanstack/react-query"
import PrimaryButton from "@/components/buttons/primary";
import type { RequestError } from "@/@types/error";
import { parseApiError } from "@/utils/parse-api-errors";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";

type DeleteCrudProps<T> = {
  mutateFn: MutationFunction<unknown, number>;
  title: string;
  useSoftDelete?: boolean;
  queryKey: string | string[];
  onSuccess?: () => void;
  closeModal: () => void;
  item: T;
  itemName?: string;
  children?: React.ReactNode;
};




const DeleteCrud = ({
  mutateFn,
  title,
  queryKey,
  closeModal,
  itemName,
  item,
  onSuccess,
  children

}: DeleteCrudProps<any>) => {

  const queryClient = useQueryClient();

  const { isPending, mutate, isSuccess, isError, error } = useMutation({
    mutationFn: mutateFn,

    onSuccess: () => {
      onSuccess && onSuccess();
      queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
      closeModal();
    },

  });


  useEffect(() => {
    if (isSuccess) {
      notification["success"]({
        message: `Removed ${title} successfully`,
        duration: 8,
      });
    }

    if (isError) {
      notification["error"]({
        message: parseApiError(error as RequestError),
        duration: 8,
      });
    }
  }, [isSuccess, isError, item]);

  return (

    <div className=" px-6 pb-6 text-center">
      <h1
        className="pb-1 text-gray-600 mb-4  text-center border-b"
      >
        CONFIRM DELETION
      </h1>

      <div className="flex justify-center text-red-500 mb-3">
        <FiAlertTriangle size={36} />
      </div>

      <h2 className="text-lg font-semibold mb-2">Delete {title}?</h2>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
      </p>

      {children ? <div className="mb-4">{children}</div> : null}

      <div className="flex justify-center space-x-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <PrimaryButton
          loading={isPending}
          disabled={isPending}
          onClick={() => mutate(item.id)}
          label={isPending ? "Deleting" : "Yes Delete !"}
          className="ml-3 bg-red-500 "
        />

        {/* <button
          onClick={() => mutate(item?.id)}
          className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
        >
          Yes, Delete
        </button> */}
      </div>
    </div >
  );
};

export default DeleteCrud;
