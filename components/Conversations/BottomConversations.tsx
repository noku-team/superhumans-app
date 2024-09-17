import useMessagesStore, { MessageRole } from '@/store/messages';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Send } from "lucide-react-native";
import { useCallback, useRef } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import useMarkdown, { textToMarkdown } from 'react-native-usemarkdown-chat';
import BouncingLoader from '../RecButton/BouncingLoader';

interface IBottomConversationsProps {
    sendNewMsg: (msg: string) => void;
}

const BottomConversations = ({ sendNewMsg }: IBottomConversationsProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
        if (index === 0) {
            // Chiudi la tastiera quando il BottomSheet è chiuso o minimizzato
            Keyboard.dismiss();
        }
    }, []);

    const { messages } = useMessagesStore();
    const [text, setText] = useMarkdown();

    const onSend = () => {
        sendNewMsg(text);
        setText('');
    };

    return (
        <BottomSheet
            snapPoints={['5%', '90%']}
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
        >
            <BottomSheetView style={{ paddingLeft: 20, paddingRight: 20, flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
                >
                    <ScrollView className='flex-1 flex gap-y-4 p-2'>
                        {messages.map(({ content = "", role }, index) => {
                            const isAIMessage = role === MessageRole.AI;
                            const isLoadingMsg = !content;
                            const positioningClass = isAIMessage ? 'self-end' : 'self-start';
                            const imagePositioning = isAIMessage ? 'flex-row-reverse' : 'flex-row'
                            const msgColour = isAIMessage ? "bg-blue-400" : 'bg-gray-400';

                            return (
                                <View className={`flex ${imagePositioning} gap-x-2 items-start ${positioningClass} max-w-[85%]`} key={`${content}-${index}`}>
                                    <Image
                                        className='rounded-full w-10 h-10'
                                        source={{
                                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                                        }}
                                    />
                                    <View className={`border-gray-200 rounded-lg p-4 space-y-3 flex items-center gap-x-1 flex-wrap ${msgColour}`}>
                                        {isLoadingMsg ? <BouncingLoader /> : <Text>{textToMarkdown(content)}</Text>}

                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>
                    <View className='w-full flex gap-x-2 items-center justify-between flex-row' style={{ marginBottom: 20 }}>
                        <TextInput
                            className='flex-1 h-12 border border-blue-500 rounded-md text-black px-2'
                            value={text}
                            onChangeText={setText}
                            placeholder='Ask a question here...'
                            placeholderTextColor="black"
                        />
                        <Pressable onPress={onSend} className='bg-blue-500 rounded-full p-2'>
                            <Send size={24} className='text-white' />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </BottomSheetView>
        </BottomSheet>
    );
};

export default BottomConversations;