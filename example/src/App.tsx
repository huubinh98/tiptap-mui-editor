import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useMemo } from "react";
import PageContentWithEditor from "./PageContentWithEditor";
export default function App() {
  const systemSettingsPrefersDarkMode = useMediaQuery(
    "(prefers-color-scheme: dark)"
  );
  // const [paletteMode, setPaletteMode] = useState<PaletteMode>(
  //   systemSettingsPrefersDarkMode ? "dark" : "light"
  // );
  // const togglePaletteMode = useCallback(() => {
  //   setPaletteMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  // }, []);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: systemSettingsPrefersDarkMode ? "dark" : "light",
        },
      }),
    [systemSettingsPrefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: 1200, my: 3, mx: "auto", px: 2 }}>
        <PageContentWithEditor />
      </Box>
    </ThemeProvider>
  );
}
