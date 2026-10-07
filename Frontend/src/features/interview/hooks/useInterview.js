import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading,
        setLoading,
        loadingMessage,
        setLoadingMessage,
        loadingSubMessage,
        setLoadingSubMessage,
        report,
        setReport,
        reports,
        setReports
    } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoadingMessage("Creating Your Custom Interview Plan...")
        setLoadingSubMessage("AI is evaluating the job description and your profile to build your strategy (approx 30s)...")
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
            alert("Failed to generate interview plan. Please check backend connection.")
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReport : null
    }

    const getReportById = async (interviewId) => {
        setLoadingMessage("Loading Your Interview Plan...")
        setLoadingSubMessage("Fetching your tailored technical and behavioral questions...")
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response ? response.interviewReport : null
    }

    const getReports = async () => {
        setLoadingMessage("Loading your saved plans...")
        setLoadingSubMessage("")
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response ? response.interviewReports : []
    }

    const getResumePdf = async (interviewReportId) => {
        setLoadingMessage("Generating Your Tailored ATS Resume...")
        setLoadingSubMessage("AI is tailoring your resume to the job description and compiling the PDF (approx 15-20s)...")
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            setTimeout(() => {
                window.URL.revokeObjectURL(url)
                link.remove()
            }, 1000)
        }
        catch (error) {
            console.log(error)
            alert("Failed to generate resume PDF. Please check server logs.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return {
        loading,
        loadingMessage,
        loadingSubMessage,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    }

}