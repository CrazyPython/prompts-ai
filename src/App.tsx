import React from 'react';
import { PromptEditor } from './components/promptEditor/PromptEditor';
import './App.css';
import {
    createMuiTheme,
    CssBaseline,
    Typography,
    ThemeProvider,
    Container,
    AppBar,
    Toolbar,
    Box,
    TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import {editApiKey, selectApiKey} from "./app/slices/editorSlice";
import {useDispatch, useSelector} from "react-redux";
import ModeTabs from "./components/modeTabs/ModeTabs";

const useStyles = makeStyles({
    description: {
        padding: '0 0 0 25px',
    },
    apiKey: {
        marginLeft: "25%"
    }
});


function App() {
    const styles = useStyles();
    const theme = createMuiTheme({
        palette: {
            type: "dark"
        }
    });
    const dispatch = useDispatch();
    const apiKey = useSelector(selectApiKey);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar position="static">
                <Container maxWidth={"lg"}>
                    <Toolbar variant="regular">
                        <Typography variant="h6" color="inherit">
                            Prompts.ai
                        </Typography>

                        <Typography className={styles.description}>
                            Advanced playground tools for GPT-3
                        </Typography>

                        <div className={styles.apiKey}>
                            <TextField type="password"
                                       label={'API Key'}
                                       variant="outlined"
                                       size={'small'}
                                       value={apiKey}
                                       onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                           dispatch(editApiKey(event.currentTarget.value));
                                       }}
                                       inputProps={{
                                           autoComplete: 'new-password',
                                           form: {
                                               autoComplete: 'off',
                                           },
                                       }}
                            />
                        </div>
                    </Toolbar>
                </Container>

            </AppBar>
            <Container maxWidth={"lg"}>
                <Box mt={2}>
                    <PromptEditor/>
                </Box>
                <Box mt={2}>
                    <ModeTabs/>
                </Box>
                <Box mt={2}>
                    <Typography>Questions or suggestions? Please reach out at seva@zhidkoff.com.</Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
