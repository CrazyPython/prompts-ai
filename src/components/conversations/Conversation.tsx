import React, {createRef, useEffect} from "react";
import {Card, CardActions, CardContent, Typography, TextField, Grid, Box, Paper, AccordionDetails, AccordionSummary, Accordion, InputAdornment, IconButton} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SendIcon from '@material-ui/icons/Send';
import { RootState } from "../../store";
import {useDispatch, useSelector} from "react-redux";
import {
    ConversationPartSource,
    normalizeConversations,
    selectPrompt,
    updateConversationInputValue,
    sendMessageInConversationAsync,
    deleteConversation,
} from "../../slices/editorSlice";
import {Delete} from "@material-ui/icons";

interface Props {
    id: string;
    ind: number;
}

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        backgroundColor: theme.palette.background.default,
        width: '100%',
    },
    settingField: {
        minWidth: '250px',
    },
    generatedText: {
        whiteSpace: 'pre-line',
        display: 'inline',
        fontWeight: 800,
    },
    promptedText: {
        whiteSpace: 'pre-line',
        display: 'inline',
        fontWeight: 400,
    },
    conversationBox: {
        minHeight: '400px',
        maxHeight: '400px',
        overflowY: 'scroll'
    },
    responseInput: {
        width: '100%'
    }
}));

export default function Conversation(props: Props) {
    const styles = useStyles();
    const dispatch = useDispatch();
    const prompt = useSelector(selectPrompt);
    const conversation = useSelector((state: RootState) => state.editor.present.conversations.find(c => c.id === props.id)!);

    const hasStarted = conversation.parts.some(c => c.submitted);
    const onInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(updateConversationInputValue({conversationId: props.id, inputValue: event.currentTarget.value}));
        dispatch(normalizeConversations());
    }
    const onSend = () => {
        dispatch(sendMessageInConversationAsync(props.id));
        conversationBottom.current!.scrollTop = conversationBottom.current!.scrollHeight;
    }

    useEffect(() => {
        conversationBottom.current!.scrollTop = conversationBottom.current!.scrollHeight;
    });

    const conversationBottom = createRef<HTMLDivElement>();

    return <Card className={styles.card}>
        <CardContent>
            <Grid container alignItems={'center'} justify={'space-between'}>
                <Grid item><Typography>
                    {!hasStarted && (
                        "New Conversation"
                    )}
                    {hasStarted && (
                        <Box>
                            <Typography component={'span'}>Conversation #{props.ind}</Typography><br/>
                            <Typography variant={'caption'} component={'span'}>The prompt and parameters are locked.</Typography>
                        </Box>
                    )}
                </Typography></Grid>
                <Grid item>
                    {hasStarted && (
                        <IconButton onClick={() => {
                            dispatch(deleteConversation(props.id));
                        }}>
                            <Delete />
                        </IconButton>
                    )}
                </Grid>
            </Grid>
            <Box mt={1} className={styles.conversationBox}>
                <Paper className={styles.conversationBox} ref={conversationBottom}>
                    <Box ml={1} mt={1}>
                        {hasStarted && (<>
                            <Typography component={'span'} className={styles.promptedText}>{conversation.initialPrompt}</Typography>
                                {conversation.parts.map(part => (<>
                                    {part.source === ConversationPartSource.gpt && <Typography component={'span'} className={styles.generatedText}>{part.text}</Typography>}
                                    {part.source === ConversationPartSource.user && <Typography component={'span'} className={styles.promptedText}>{part.text}</Typography>}
                                </>))}
                        </>)}
                        {!hasStarted && (<>
                            <Typography component={'span'} className={styles.promptedText}>{prompt}</Typography>
                            <Typography component={'span'} className={styles.promptedText}>{conversation.restartSequence}</Typography>
                        </>)}
                        <div />
                    </Box>
                </Paper>
            </Box>
            <Box mt={2} className={styles.responseInput}>
                <TextField multiline
                           label={'Message (Ctrl+Enter to send)'}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           placeholder={hasStarted ? 'Your response' : 'Start a conversation'}
                           value={conversation.inputValue}
                           onChange={onInputChange}
                           onKeyUp={(event: React.KeyboardEvent<HTMLDivElement>) => {
                               if (event.ctrlKey && event.key === 'Enter') {
                                   onSend();
                               }
                           }}
                           variant={'outlined'}
                           fullWidth={true}
                           InputProps={{
                               endAdornment: (<InputAdornment position="end">
                               <IconButton edge="end" onClick={onSend}>
                                   <SendIcon />
                               </IconButton>
                               </InputAdornment>)
                           }}
                />
            </Box>
            <Box mt={1}>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Parameters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <Grid container spacing={1}>
                                <Grid item><TextField value={'\\nPerson: '} className={styles.settingField} label={'Before User Input'} variant={'outlined'}/></Grid>
                                <Grid item><TextField value={'\\nAI:'} className={styles.settingField} label={'Before GPT-3 Completion'} variant={'outlined'}/></Grid>
                            </Grid>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

        </CardContent>
        <CardActions>
        </CardActions>
    </Card>;
}
