import { supabase } from '../lib/supabase'

export const db = {
    // Reflections (Daily Stories)
    async getReflection(date) {
        const { data, error } = await supabase
            .from('reflections')
            .select('*')
            .eq('date', date)
            .single()

        if (error && error.code !== 'PGRST116') throw error // PGRST116 is code for no rows found
        return data
    },

    async saveReflection(reflectionData) {
        const { data, error } = await supabase
            .from('reflections')
            .upsert(reflectionData, { onConflict: 'date' })

        if (error) throw error
        return data
    },

    // Logs (Prayer, Fast, Journal)
    async saveLog(logData) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('user_logs')
            .insert([{
                user_id: user.id,
                ...logData
            }])
            .select()

        if (error) throw error
        return data
    },

    async getLogs(dayKey) {
        const { data, error } = await supabase
            .from('user_logs')
            .select('*')
            .eq('day_key', dayKey)
            .order('ts', { ascending: false })

        if (error) throw error
        return data
    },

    async getAllLogs() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('user_logs')
            .select('*')
            .eq('user_id', user.id)
            .order('ts', { ascending: false })

        if (error) throw error
        return data || []
    },

    // Progress
    async getProgress() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    async updateProgress(completedDays) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: user.id,
                completed_days: completedDays,
                last_updated: new Date().toISOString()
            })

        if (error) throw error
        return data
    }
}
