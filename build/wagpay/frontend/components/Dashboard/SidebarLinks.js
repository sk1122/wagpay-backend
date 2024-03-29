"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_1 = __importDefault(require("next/link"));
const SidebarLinks = (props) => {
    return (<div className="flex flex-col items-center justify-center space-y-4">
      <link_1.default href="/">
        <a className="rounded bg-[#6C7EE2] text-black">
          {props.children}
          <span className="mx-4 text-white">{props.name}</span>
        </a>
      </link_1.default>
    </div>
    // <a className="flex justify-start items-center w-11/12 px-4 py-3 text-black bg-[#6C7EE2] rounded-xl focus:ring" href="#">
    // 	{props.children}
    // 	<span className="mx-4 text-white">{props.name}</span>
    // </a>
    // <div classNameName="flex items-center px-4 py-2 w-full py-4 bg-[#6C7EE2] rounded-xl">
    // 	{props.children}
    // 	<h1 classNameName="mx-4 text-sm">{props.name}</h1>
    // </div>
    );
};
exports.default = SidebarLinks;
