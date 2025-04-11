import React, { useRef, useState } from "react";
import { ListItem, PostStyle } from "../types";
import { User, Plus, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import StyleEditor from "./StyleEditor";
import { stylePresets } from "../styles/presets";
import AuthDialog from "./AuthDialog";
import { supabase } from "../lib/supabase";
import InfoTooltip from "./InfoTooltip";
import PostItem from "./PostItem";
import UserMenu from "./UserMenu";
import html2canvas from "html2canvas";

interface PostGeneratorProps {
  user: User | null;
}

export default function PostGenerator({ user }: PostGeneratorProps) {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<ListItem[]>([
    { title: "", description: "" },
  ]);
  const [style, setStyle] = useState<PostStyle>(stylePresets[0]);
  const [grid, setGrid] = useState({ rows: 2, columns: 2 });
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const addItem = () => {
    setItems([...items, { title: "", description: "" }]);
  };

  const updateItem = (index: number, field: keyof ListItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleDownload = async () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    if (!previewRef.current) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create a temporary link element
      const link = document.createElement("a");
      link.download = "linkedin-post.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getBackgroundStyle = () => {
    const bg = style.background;
    if (bg.type === "image" && bg.imageUrl) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, ${
          bg.imageDarkness || 0
        }), rgba(0, 0, 0, ${bg.imageDarkness || 0})), url(${bg.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    if (bg.type === "gradient") {
      if (bg.gradientType === "radial") {
        return {
          background: `radial-gradient(circle at center, ${bg.color}, ${bg.gradientColor})`,
        };
      }
      return {
        background: `linear-gradient(${bg.gradientDirection}, ${bg.color}, ${bg.gradientColor})`,
      };
    }
    return {
      backgroundColor: bg.color,
    };
  };

  const processText = (text: string) => {
    return text.split("*").map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} style={{ color: style.background.accentColor }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const processDescription = (text: string) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {processText(line)}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getCardStyle = () => {
    const {
      backgroundColor,
      opacity,
      showBorder,
      borderWidth,
      borderColor,
      borderRadius,
    } = style.card;
    return {
      backgroundColor:
        backgroundColor +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0"),
      ...(showBorder && {
        border: `${borderWidth}px solid ${borderColor}`,
      }),
      borderRadius: `${borderRadius}px`,
    };
  };

  const getFooterStyle = () => {
    const { backgroundColor, opacity, showBorder, borderWidth, borderColor } =
      style.card;
    return {
      backgroundColor:
        backgroundColor +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0"),
      ...(showBorder && {
        borderTop: `${borderWidth}px solid ${borderColor}`,
      }),
    };
  };

  const getItemNumberStyle = () => {
    const {
      backgroundColor,
      opacity,
      showBorder,
      borderWidth,
      borderColor,
      borderRadius,
      padding,
      fixedSize,
      width,
      height,
    } = style.itemNumberStyle;
    return {
      backgroundColor:
        backgroundColor +
        Math.round(opacity * 255)
          .toString(16)
          .padStart(2, "0"),
      ...(showBorder && {
        border: `${borderWidth}px solid ${borderColor}`,
      }),
      borderRadius: `${borderRadius}px`,
      padding: fixedSize ? 0 : `${padding}px`,
      width: fixedSize ? `${width}px` : "fit-content",
      height: fixedSize ? `${height}px` : "fit-content",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: `-${padding}px`,
      left: `-${padding}px`,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Parameters */}

      <div className="w-80 border-r bg-white fixed left-0 top-0 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-4">
            <svg
              className="mx-auto"
              width="180"
              height="40"
              viewBox="0 0 1656 376"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M467.903 267.967C455.352 267.967 443.269 266.375 431.654 263.19C420.227 259.818 411.141 255.79 404.397 251.107L417.885 224.412C424.629 228.721 432.684 232.28 442.051 235.09C451.418 237.9 460.784 239.305 470.151 239.305C481.204 239.305 489.165 237.806 494.036 234.809C499.094 231.812 501.623 227.784 501.623 222.726C501.623 218.605 499.937 215.514 496.565 213.453C493.193 211.205 488.791 209.519 483.358 208.395C477.925 207.271 471.837 206.241 465.093 205.304C458.536 204.367 451.886 203.15 445.142 201.651C438.585 199.965 432.591 197.623 427.158 194.626C421.725 191.441 417.323 187.226 413.951 181.981C410.579 176.736 408.893 169.804 408.893 161.187C408.893 151.633 411.609 143.39 417.042 136.459C422.475 129.34 430.062 123.908 439.803 120.161C449.732 116.227 461.44 114.26 474.928 114.26C485.044 114.26 495.254 115.384 505.557 117.632C515.86 119.88 524.384 123.065 531.128 127.186L517.64 153.881C510.521 149.572 503.309 146.669 496.003 145.17C488.884 143.484 481.766 142.641 474.647 142.641C463.969 142.641 456.007 144.233 450.762 147.418C445.704 150.603 443.175 154.63 443.175 159.501C443.175 163.997 444.861 167.369 448.233 169.617C451.605 171.865 456.007 173.645 461.44 174.956C466.873 176.267 472.867 177.391 479.424 178.328C486.168 179.077 492.818 180.295 499.375 181.981C505.932 183.667 511.926 186.009 517.359 189.006C522.979 191.816 527.475 195.844 530.847 201.089C534.219 206.334 535.905 213.172 535.905 221.602C535.905 230.969 533.095 239.118 527.475 246.049C522.042 252.98 514.268 258.413 504.152 262.347C494.036 266.094 481.953 267.967 467.903 267.967ZM625.445 267.967C608.772 267.967 594.16 264.689 581.609 258.132C569.245 251.388 559.597 242.209 552.666 230.594C545.922 218.979 542.55 205.772 542.55 190.973C542.55 175.986 545.828 162.779 552.385 151.352C559.129 139.737 568.308 130.652 579.923 124.095C591.725 117.538 605.119 114.26 620.106 114.26C634.718 114.26 647.738 117.445 659.165 123.814C670.592 130.183 679.584 139.175 686.141 150.79C692.698 162.405 695.976 176.08 695.976 191.816C695.976 193.315 695.882 195.001 695.695 196.874C695.695 198.747 695.601 200.527 695.414 202.213H570.369V178.89H676.868L663.099 186.196C663.286 177.579 661.507 169.992 657.76 163.435C654.013 156.878 648.862 151.727 642.305 147.98C635.936 144.233 628.536 142.36 620.106 142.36C611.489 142.36 603.902 144.233 597.345 147.98C590.976 151.727 585.918 156.972 582.171 163.716C578.612 170.273 576.832 178.047 576.832 187.039V192.659C576.832 201.651 578.893 209.613 583.014 216.544C587.135 223.475 592.943 228.814 600.436 232.561C607.929 236.308 616.547 238.181 626.288 238.181C634.718 238.181 642.305 236.87 649.049 234.247C655.793 231.624 661.788 227.503 667.033 221.883L685.86 243.52C679.116 251.388 670.592 257.476 660.289 261.785C650.173 265.906 638.558 267.967 625.445 267.967ZM693.847 266L759.882 180.014L759.32 198.841L696.376 115.946H735.435L779.552 174.956H764.659L809.057 115.946H846.992L783.486 198.841L783.767 180.014L849.521 266H809.9L763.535 203.337L778.147 205.304L732.625 266H693.847ZM868.058 322.481C860.752 322.481 853.446 321.263 846.14 318.828C838.834 316.393 832.745 313.021 827.875 308.712L841.925 282.86C845.484 286.045 849.512 288.574 854.008 290.447C858.504 292.32 863.093 293.257 867.777 293.257C874.146 293.257 879.298 291.665 883.232 288.48C887.166 285.295 890.819 279.956 894.191 272.463L902.902 252.793L905.712 248.578L962.474 115.946H996.194L925.944 278.083C921.26 289.323 916.015 298.221 910.208 304.778C904.588 311.335 898.218 315.924 891.1 318.547C884.168 321.17 876.488 322.481 868.058 322.481ZM898.968 271.339L831.247 115.946H867.777L922.853 245.487L898.968 271.339ZM1090.08 267.967C1077.91 267.967 1066.76 265.157 1056.64 259.537C1046.72 253.917 1038.75 245.487 1032.76 234.247C1026.95 222.82 1024.05 208.395 1024.05 190.973C1024.05 173.364 1026.86 158.939 1032.48 147.699C1038.29 136.459 1046.15 128.123 1056.08 122.69C1066.01 117.07 1077.34 114.26 1090.08 114.26C1104.88 114.26 1117.9 117.445 1129.14 123.814C1140.57 130.183 1149.56 139.082 1156.12 150.509C1162.86 161.936 1166.23 175.424 1166.23 190.973C1166.23 206.522 1162.86 220.103 1156.12 231.718C1149.56 243.145 1140.57 252.044 1129.14 258.413C1117.9 264.782 1104.88 267.967 1090.08 267.967ZM1006.91 320.514V115.946H1040.35V151.352L1039.22 191.254L1042.03 231.156V320.514H1006.91ZM1086.15 237.9C1094.58 237.9 1102.07 236.027 1108.63 232.28C1115.37 228.533 1120.71 223.101 1124.65 215.982C1128.58 208.863 1130.55 200.527 1130.55 190.973C1130.55 181.232 1128.58 172.895 1124.65 165.964C1120.71 158.845 1115.37 153.413 1108.63 149.666C1102.07 145.919 1094.58 144.046 1086.15 144.046C1077.72 144.046 1070.13 145.919 1063.39 149.666C1056.64 153.413 1051.3 158.845 1047.37 165.964C1043.44 172.895 1041.47 181.232 1041.47 190.973C1041.47 200.527 1043.44 208.863 1047.37 215.982C1051.3 223.101 1056.64 228.533 1063.39 232.28C1070.13 236.027 1077.72 237.9 1086.15 237.9ZM1255.75 267.967C1240.38 267.967 1226.71 264.689 1214.72 258.132C1202.73 251.388 1193.27 242.209 1186.34 230.594C1179.41 218.979 1175.94 205.772 1175.94 190.973C1175.94 175.986 1179.41 162.779 1186.34 151.352C1193.27 139.737 1202.73 130.652 1214.72 124.095C1226.71 117.538 1240.38 114.26 1255.75 114.26C1271.29 114.26 1285.06 117.538 1297.05 124.095C1309.23 130.652 1318.69 139.644 1325.43 151.071C1332.36 162.498 1335.83 175.799 1335.83 190.973C1335.83 205.772 1332.36 218.979 1325.43 230.594C1318.69 242.209 1309.23 251.388 1297.05 258.132C1285.06 264.689 1271.29 267.967 1255.75 267.967ZM1255.75 237.9C1264.36 237.9 1272.04 236.027 1278.79 232.28C1285.53 228.533 1290.78 223.101 1294.52 215.982C1298.46 208.863 1300.42 200.527 1300.42 190.973C1300.42 181.232 1298.46 172.895 1294.52 165.964C1290.78 158.845 1285.53 153.413 1278.79 149.666C1272.04 145.919 1264.46 144.046 1256.03 144.046C1247.41 144.046 1239.73 145.919 1232.98 149.666C1226.43 153.413 1221.18 158.845 1217.25 165.964C1213.31 172.895 1211.35 181.232 1211.35 190.973C1211.35 200.527 1213.31 208.863 1217.25 215.982C1221.18 223.101 1226.43 228.533 1232.98 232.28C1239.73 236.027 1247.32 237.9 1255.75 237.9ZM1404.54 267.967C1391.99 267.967 1379.91 266.375 1368.29 263.19C1356.87 259.818 1347.78 255.79 1341.04 251.107L1354.53 224.412C1361.27 228.721 1369.33 232.28 1378.69 235.09C1388.06 237.9 1397.43 239.305 1406.79 239.305C1417.84 239.305 1425.81 237.806 1430.68 234.809C1435.73 231.812 1438.26 227.784 1438.26 222.726C1438.26 218.605 1436.58 215.514 1433.21 213.453C1429.83 211.205 1425.43 209.519 1420 208.395C1414.57 207.271 1408.48 206.241 1401.73 205.304C1395.18 204.367 1388.53 203.15 1381.78 201.651C1375.23 199.965 1369.23 197.623 1363.8 194.626C1358.37 191.441 1353.96 187.226 1350.59 181.981C1347.22 176.736 1345.53 169.804 1345.53 161.187C1345.53 151.633 1348.25 143.39 1353.68 136.459C1359.12 129.34 1366.7 123.908 1376.44 120.161C1386.37 116.227 1398.08 114.26 1411.57 114.26C1421.68 114.26 1431.89 115.384 1442.2 117.632C1452.5 119.88 1461.02 123.065 1467.77 127.186L1454.28 153.881C1447.16 149.572 1439.95 146.669 1432.64 145.17C1425.53 143.484 1418.41 142.641 1411.29 142.641C1400.61 142.641 1392.65 144.233 1387.4 147.418C1382.34 150.603 1379.82 154.63 1379.82 159.501C1379.82 163.997 1381.5 167.369 1384.87 169.617C1388.25 171.865 1392.65 173.645 1398.08 174.956C1403.51 176.267 1409.51 177.391 1416.06 178.328C1422.81 179.077 1429.46 180.295 1436.02 181.981C1442.57 183.667 1448.57 186.009 1454 189.006C1459.62 191.816 1464.12 195.844 1467.49 201.089C1470.86 206.334 1472.55 213.172 1472.55 221.602C1472.55 230.969 1469.74 239.118 1464.12 246.049C1458.68 252.98 1450.91 258.413 1440.79 262.347C1430.68 266.094 1418.59 267.967 1404.54 267.967ZM1548.04 267.967C1531.55 267.967 1518.81 263.752 1509.82 255.322C1500.83 246.705 1496.33 234.06 1496.33 217.387V82.788H1531.46V216.544C1531.46 223.663 1533.24 229.189 1536.8 233.123C1540.54 237.057 1545.69 239.024 1552.25 239.024C1560.12 239.024 1566.68 236.963 1571.92 232.842L1581.76 257.851C1577.63 261.223 1572.58 263.752 1566.58 265.438C1560.59 267.124 1554.41 267.967 1548.04 267.967ZM1471.6 145.17V117.07H1571.64V145.17H1471.6Z"
                fill="black"
              />
              <path
                d="M185.953 131.93L128.234 98.6058L54 227.182L182.576 301.416L215.901 243.697L145.043 202.787L185.953 131.93Z"
                fill="black"
              />
              <path
                d="M215.901 243.697L273.62 277.021L347.853 148.444L219.277 74.2107L185.953 131.93L256.81 172.839L215.901 243.697Z"
                fill="black"
              />
            </svg>

            <div className="space-y-2">
              <UserMenu
                user={user}
                onShowAuth={() => setShowAuthDialog(true)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Titre</Label>
                <InfoTooltip text="Utilisez * pour mettre en valeur le texte" />
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du post"
              />
            </div>

            <div className="space-y-2">
              <Label>Disposition de la grille</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Lignes</Label>
                  <select
                    className="w-full h-9 rounded-md border px-3 py-1 text-sm"
                    value={grid.rows}
                    onChange={(e) =>
                      setGrid({ ...grid, rows: Number(e.target.value) })
                    }
                  >
                    {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Colonnes</Label>
                  <select
                    className="w-full h-9 rounded-md border px-3 py-1 text-sm"
                    value={grid.columns}
                    onChange={(e) =>
                      setGrid({ ...grid, columns: Number(e.target.value) })
                    }
                  >
                    {[1, 2, 3].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Items</Label>
                <InfoTooltip text="Utilisez * pour mettre en valeur le texte" />
              </div>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <PostItem
                    key={index}
                    item={item}
                    index={index}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                  />
                ))}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={addItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom button */}
        <div className="border-t bg-white p-4">
          <Button
            className="w-full"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Téléchargement..." : "Télécharger l'image"}
          </Button>
        </div>
      </div>

      {/* Center - Preview */}
      <div className="flex-1 p-6 flex items-center justify-center ml-80 mr-80 bg-blue-50">
        <div className="w-[600px]">
          <div
            ref={previewRef}
            className="aspect-[4/5] overflow-hidden shadow-xl"
            style={{ ...getBackgroundStyle(), fontFamily: style.font }}
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 flex flex-col" style={{
                padding: `${style.contentPadding.top}px ${style.contentPadding.right}px ${style.contentPadding.bottom}px ${style.contentPadding.left}px`
              }}>
                <h1
                  className="font-bold mb-12 leading-tight"
                  style={{
                    fontSize: `${style.titleSize}px`,
                    color: style.colors.title,
                  }}
                >
                  {processText(title || "Titre du *post*")}
                </h1>

                <div
                  className="flex-1 grid"
                  style={{
                    gridTemplateColumns: `repeat(${grid.columns}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${grid.rows}, minmax(0, 1fr))`,
                    gap: `${style.itemSpacing}px`,
                  }}
                >
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="relative"
                      style={{
                        ...getCardStyle(),
                        paddingTop: `${style.itemPadding.top}px`,
                        paddingRight: `${style.itemPadding.right}px`,
                        paddingBottom: `${style.itemPadding.bottom}px`,
                        paddingLeft: `${style.itemPadding.left}px`,
                      }}
                    >
                      {style.showItemNumbers && (
                        <div
                          style={{
                            ...getItemNumberStyle(),
                            fontSize: `${style.itemNumberSize}px`,
                            color: style.colors.itemNumber,
                            lineHeight: 1,
                          }}
                        >
                          {index + 1}
                        </div>
                      )}
                      <div
                        className="relative font-bold"
                        style={{
                          fontSize: `${style.itemTitleSize}px`,
                          marginBottom: `${style.titleDescriptionSpacing}px`,
                          color: style.colors.itemTitle,
                        }}
                      >
                        {processText(item.title || `Item ${index + 1}`)}
                      </div>
                      {item.description && (
                        <div
                          className="relative leading-relaxed"
                          style={{
                            fontSize: `${style.descriptionSize}px`,
                            color: style.colors.description,
                          }}
                        >
                          {processDescription(item.description)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center justify-between"
                style={{
                  ...getFooterStyle(),
                  padding: `${style.footerPadding.top}px ${style.footerPadding.right}px ${style.footerPadding.bottom}px ${style.footerPadding.left}px`,
                }}
              >
                <div className="flex items-center gap-4">
                  {style.footer.photoUrl ? (
                    <img
                      src={style.footer.photoUrl}
                      alt={style.footer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <User
                        className="w-8 h-8"
                        style={{ color: style.colors.footerName }}
                      />
                    </div>
                  )}
                  <div>
                    <div
                      className="font-semibold"
                      style={{
                        fontSize: `${style.footerSize}px`,
                        color: style.colors.footerName,
                      }}
                    >
                      {processText(style.footer.name)}
                    </div>
                    {style.footer.subtitle && (
                      <div
                        style={{
                          fontSize: `${style.footerSubtitleSize}px`,
                          color: style.colors.footerSubtitle,
                        }}
                      >
                        {processText(style.footer.subtitle)}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: `${style.footerSize}px`,
                    color: style.colors.footerRight,
                  }}
                >
                  {processText(style.footer.rightText)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Style Editor */}
      <div className="w-80 border-l bg-white fixed right-0 top-0 h-full">
        <StyleEditor currentStyle={style} onStyleChange={setStyle} />
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </div>
  );
}