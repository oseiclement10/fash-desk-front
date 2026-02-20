
import { Spin } from "antd";


type SpinLoadProps = {
  caption?: string | React.ReactNode;
  message?: string;
  className?: string;
}

const PageLoad = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white/25">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent" />
        <span className="text-center text-gray-700">loading please wait ....</span>
      </div>
    </div>
  );
};

export const SpinLoad = ({ caption, message, className }: SpinLoadProps) => {
  return (
    <div className={`mx-auto text-center py-5 flex flex-col items-center ${className}`}>
      <h2 className="mb-6 text-lg font-semibold text-slate-700">{caption}</h2>
      <Spin />
      <p className="my-4 text-gray-600">{message}</p>
    </div>
  );
};

export const PulseLoad = () => {
  return (
    <div className="border  shadow rounded-md p-4 w-full mx-auto bg-white h-[300px]">
      <div className="flex space-x-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
        <div className="flex-1 py-1 space-y-6">
          <div className="h-2 rounded bg-slate-200"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 col-span-2 rounded bg-slate-200"></div>
              <div className="h-2 col-span-1 rounded bg-slate-200"></div>
            </div>
            <div className="h-2 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoad;
