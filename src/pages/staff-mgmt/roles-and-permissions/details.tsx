import type { Role } from "@/@types/central-entities"
import type { OverlayProps } from "@/@types/common"
import { FormHeader } from "@/components/crud/form-config";
import { Button } from "@/components/ui/button";
import {  Shield, Key } from "lucide-react";

const RoleDetails = ({ closeModal, data: role }: Omit<OverlayProps<Role>, "mode" | "api">) => {
    return (
        <div className="bg-white/80 backdrop-blur-lg px-3 rounded-3xl  border border-white/60 overflow-hidden">
            <FormHeader>
                Role Details
            </FormHeader>
            <div className=" pt-6  pb-4   mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl uppercase font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {role?.name.replace("-", " ")}
                            </h1>
                            {role?.description && (
                                <p className="text-gray-600  text-base">
                                    {role?.description}
                                </p>
                            )}
                        </div>
                    </div>
                   
                </div>
            </div>

            {/* Permissions Section */}
            <div className="">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Key className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Role Permissions</h3>
                </div>

                {role?.permissions && role.permissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {role.permissions.map((permission) => (
                            <div
                                key={permission.id}
                                className="bg-white/60 backdrop-blur-sm border rounded-xl p-4 shadow-sm border-blue-200/60 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                                    <span className="text-gray-800 capitalize font-medium">
                                        {permission.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-gray-300/60 rounded-2xl bg-white/40">
                        <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-xl font-medium">No permissions assigned</p>
                        <p className="text-gray-500 mt-2">
                            Add permissions to define what this role can access
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-white/40 border-t border-white/40">
                <div className="flex justify-end">
                    <Button
                        onClick={closeModal}
                        className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white px-8 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Close Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoleDetails;