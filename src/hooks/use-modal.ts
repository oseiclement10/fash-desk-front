import { useState } from "react";
import type { ModalMode, ModalProps } from "@/@types/common";
export const useModalProps = <T>() => {

    const [modalOpen, setModalOpen] = useState<ModalProps<T>>({
        open: false,
        type: "add",
        data: null,
    });

    const closeModal = () => setModalOpen({ ...modalOpen, open: false });
    const updateModal = (data: T | null, type: ModalMode) => setModalOpen({ open: true, type: type, data });

    return { modalOpen, closeModal, updateModal };

}

