declare module 'otter.ai-api' {
    interface ClientOptions {
        email: string,
        password: string,
    }

    export interface Owner {
        id: number
        name: string
        email: string
        first_name: string
        last_name: string
        avatar_url: string
    }

    export interface WordCloud {
        variants: string[]
        score: string
        word: string
    }

    export interface SessionInfo {
        live_status: string
        live_status_message: string
        id?: any
        title: string
        offset: number
    }

    export interface Alignment {
        end: number
        endOffset: number
        start: number
        startOffset: number
        word: string
    }

    export interface Transcript {
        start_offset: number
        end_offset: number
        speaker_model_label: string
        transcript: string
        id: number
        alignment: Alignment[]
        speaker_id?: any
        uuid: string
        speaker_edited_at?: any
        created_at: string
        label: string
        sig: string
        speech_id: string
    }

    export interface MatchedTranscript {
        transcript_id: number
        matched_transcript: string
        uuid: string
        start_offset: number
        highlight_spans: HighlightSpan[]
    }

    export interface Speech {
        speech_id: string
        start_time: number
        end_time: number
        modified_time: number
        deleted: boolean
        duration: number
        title?: any
        summary: string
        from_shared: boolean
        shared_with: any[]
        unshared: boolean
        shared_by?: any
        owner: Owner
        shared_groups: any[]
        can_edit: boolean
        can_comment: boolean
        is_read: boolean
        process_finished: boolean
        upload_finished: boolean
        hasPhotos: number
        download_url: string
        transcript_updated_at: number
        images: any[]
        speakers: any[]
        word_clouds: WordCloud[]
        live_status: string
        live_status_message: string
        public_share_url: string
        folder?: any
        created_at: number
        access_seconds: number
        appid: string
        can_highlight: boolean
        create_method: string
        otid: string
        can_export: boolean
        timecode_offset?: any
        timezone?: any
        access_request?: any
        public_view: boolean
        has_started: boolean
        auto_record: boolean
        displayed_start_time: number
        session_info: SessionInfo[]
        has_hidden_transcript: boolean
        transcripts: Transcript[]
        realign_finished: boolean
        rematch_finished: boolean
        diarization_finished: boolean
        rematch_cutoff_time?: any
        annotations: any[]
        audio_url: string
    }


    export interface SpeechSummary {
        // todo unify with the Speech?
        speech_id: string
        start_time: number
        end_time: number
        modified_time: number
        deleted: boolean
        duration: number
        title: string | null
        summary: string
        from_shared: boolean
        shared_with: any[]
        unshared: boolean
        shared_by?: any
        owner: Owner
        shared_groups: any[]
        can_edit: boolean
        can_comment: boolean
        is_read: boolean
        process_finished: boolean
        upload_finished: boolean
        hasPhotos: number
        download_url: string
        transcript_updated_at: number
        images: any[]
        speakers: any[]
        word_clouds: WordCloud[]
        live_status: string
        live_status_message: string
        public_share_url?: any
        folder?: any
        created_at: number
        access_seconds: number
        appid: string
        can_highlight: boolean
        create_method: string
        otid: string
        can_export: boolean
        timecode_offset?: any
        timezone?: any
        access_request?: any
        public_view: boolean
        has_started: boolean
        auto_record: boolean
        displayed_start_time: number
    }


    export interface HighlightSpan {
        transcript_end: number
        span_text: string
        match_end: number
        match_start: number
        transcript_start: number
    }


    export interface SearchResult {
        matched_transcripts: MatchedTranscript[]
        appid: string
        user_id: number
        folder_id?: any
        groups: any[]
        title: string | null
        duration: number
        start_time: number
        speech_id: string
        speech_otid: string
    }

    interface OtterClient {
        getSpeeches(): Promise<Array<SpeechSummary>>

        getSpeech(id: string): Promise<Speech>

        speechSearch(query: string): Promise<Array<SearchResult>>
    }

    function createClient(options: ClientOptions): Promise<OtterClient>
}
