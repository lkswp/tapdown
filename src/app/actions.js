"use server";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocialVideo = getSocialVideo;
// @ts-ignore
var instagramGetUrl = require("instagram-url-direct").instagramGetUrl;
var YTDlpWrap = require('yt-dlp-wrap').default;
var path = require('path');
function getSocialVideo(url) {
    return __awaiter(this, void 0, void 0, function () {
        var cleanUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    cleanUrl = url.trim();
                    if (!cleanUrl.includes("tiktok.com")) return [3 /*break*/, 2];
                    return [4 /*yield*/, downloadTikTok(cleanUrl)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!cleanUrl.includes("instagram.com")) return [3 /*break*/, 4];
                    return [4 /*yield*/, downloadInstagram(cleanUrl)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    if (!(cleanUrl.includes("youtube.com") ||
                        cleanUrl.includes("youtu.be") ||
                        cleanUrl.includes("twitter.com") ||
                        cleanUrl.includes("x.com") ||
                        cleanUrl.includes("facebook.com") ||
                        cleanUrl.includes("fb.watch"))) return [3 /*break*/, 6];
                    return [4 /*yield*/, downloadYtDlp(cleanUrl)];
                case 5: return [2 /*return*/, _a.sent()];
                case 6: return [2 /*return*/, { success: false, error: "Unsupported platform or invalid URL." }];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error("Download error:", error_1);
                    return [2 /*return*/, { success: false, error: "Failed to process URL. Please try again." }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function downloadTikTok(url) {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, response, json, e_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    apiUrl = "https://www.tikwm.com/api/?url=".concat(encodeURIComponent(url), "&hd=1");
                    return [4 /*yield*/, fetch(apiUrl)];
                case 1:
                    response = _c.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _c.sent();
                    if (json.code === 0) {
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    platform: 'tiktok',
                                    url: json.data.play,
                                    hdUrl: json.data.hdplay,
                                    audioUrl: json.data.music, // TikTok provides audio URL
                                    thumbnail: json.data.cover,
                                    title: json.data.title,
                                    author: ((_a = json.data.author) === null || _a === void 0 ? void 0 : _a.nickname) || ((_b = json.data.author) === null || _b === void 0 ? void 0 : _b.unique_id)
                                }
                            }];
                    }
                    else {
                        return [2 /*return*/, { success: false, error: json.msg || "TikTok API error" }];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    console.error("TikTok Fetch Error:", e_1);
                    return [2 /*return*/, { success: false, error: "Failed to fetch from TikTok" }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function downloadInstagram(url) {
    return __awaiter(this, void 0, void 0, function () {
        var result, videoUrl, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, instagramGetUrl(url)];
                case 1:
                    result = _a.sent();
                    if (result && result.url_list && result.url_list.length > 0) {
                        videoUrl = result.url_list[0];
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    platform: 'instagram',
                                    url: videoUrl,
                                    // Instagram doesn't provide separate audio URL easily
                                    thumbnail: "",
                                    title: "Instagram Reel",
                                    author: "Instagram User"
                                }
                            }];
                    }
                    else {
                        return [2 /*return*/, { success: false, error: "No video found in Instagram link" }];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    console.error("Instagram Fetch Error:", e_2);
                    return [2 /*return*/, { success: false, error: "Failed to fetch from Instagram: ".concat(e_2.message || "Unknown error") }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function downloadYtDlp(url) {
    return __awaiter(this, void 0, void 0, function () {
        var currentPlatform, binaryName, binaryPath, ytDlpWrap, nodePath, args, stdout, metadata, formats, bestFormat, audioFormat, e_3, errorString, userFacingError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("Downloading video with yt-dlp: ".concat(url));
                    currentPlatform = 'other';
                    if (url.includes('youtube.com') || url.includes('youtu.be'))
                        currentPlatform = 'youtube';
                    if (url.includes('twitter.com') || url.includes('x.com'))
                        currentPlatform = 'twitter';
                    if (url.includes('facebook.com') || url.includes('fb.watch'))
                        currentPlatform = 'facebook';
                    binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
                    binaryPath = path.join(process.cwd(), 'bin', binaryName);
                    ytDlpWrap = new YTDlpWrap(binaryPath);
                    nodePath = process.execPath;
                    args = [
                        url,
                        '--dump-json',
                        '--no-playlist',
                        '--js-runtimes',
                        "node:".concat(nodePath)
                    ];
                    return [4 /*yield*/, ytDlpWrap.execPromise(args)];
                case 1:
                    stdout = _a.sent();
                    metadata = JSON.parse(stdout);
                    if (!metadata) {
                        return [2 /*return*/, { success: false, error: "Failed to fetch video metadata from yt-dlp." }];
                    }
                    formats = metadata.formats || [];
                    bestFormat = formats.find(function (f) { return f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4' && (f.format_id === '22' || f.height >= 720); });
                    if (!bestFormat) {
                        bestFormat = formats.find(function (f) { return f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4'; });
                    }
                    // 2. If no pre-merged mp4, try ANY pre-merged
                    if (!bestFormat) {
                        bestFormat = formats.find(function (f) { return f.vcodec !== 'none' && f.acodec !== 'none'; });
                    }
                    // 3. Twitter/Facebook sometimes just return a single url as 'url' in metadata, or formats with just 'video'
                    if (!bestFormat && metadata.url) {
                        bestFormat = { url: metadata.url }; // Fallback for simple structures
                    }
                    // 4. If all else fails, just find the first thing that has a video codec
                    if (!bestFormat) {
                        bestFormat = formats.find(function (f) { return f.vcodec !== 'none'; });
                    }
                    audioFormat = formats.find(function (f) { return f.acodec !== 'none' && f.vcodec === 'none' && (f.ext === 'm4a' || f.ext === 'mp3'); });
                    if (!bestFormat || !bestFormat.url) {
                        return [2 /*return*/, { success: false, error: "No suitable video format could be found for this link." }];
                    }
                    return [2 /*return*/, {
                            success: true,
                            data: {
                                platform: currentPlatform,
                                url: bestFormat.url,
                                hdUrl: bestFormat.url,
                                audioUrl: audioFormat === null || audioFormat === void 0 ? void 0 : audioFormat.url,
                                thumbnail: metadata.thumbnail,
                                title: metadata.title || "".concat(currentPlatform, " Video"),
                                author: metadata.uploader || metadata.channel || "Unknown Author"
                            }
                        }];
                case 2:
                    e_3 = _a.sent();
                    console.error("yt-dlp Fetch Error:", e_3);
                    errorString = e_3.stderr || e_3.message;
                    userFacingError = "Failed to process ".concat(url, ".");
                    if (errorString.includes("No video could be found in this tweet")) {
                        userFacingError = "No video could be found in this Twitter/X link.";
                    }
                    else if (errorString.includes("Requested format is not available")) {
                        userFacingError = "The requested video format is not available.";
                    }
                    else if (errorString.includes("Private video") || errorString.includes("Login required")) {
                        userFacingError = "This video is private or requires login.";
                    }
                    return [2 /*return*/, { success: false, error: userFacingError }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getVideoId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
