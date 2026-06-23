"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Mail } from "lucide-react";
import { motion } from "framer-motion";

const EMAIL_TEMPLATES = [
  {
    id: "1",
    name: "Appointment Confirmation",
    subject: "Your Appointment is Confirmed - {{doctorName}}",
    body: `Dear {{patientName}},

Your appointment has been confirmed with Dr. {{doctorName}} at {{clinicName}}.

Appointment Details:
Date: {{appointmentDate}}
Time: {{appointmentTime}}
Location: {{clinicAddress}}
Doctor: Dr. {{doctorName}} ({{specialization}})

Please arrive 10 minutes before your scheduled appointment time.

For any changes or cancellations, please contact us at {{clinicPhone}}.

Best regards,
Hospital AI CRM Team`,
    variables: ["patientName", "doctorName", "clinicName", "appointmentDate", "appointmentTime", "clinicAddress", "specialization", "clinicPhone"],
  },
  {
    id: "2",
    name: "Appointment Reminder",
    subject: "Reminder: Your Appointment Tomorrow",
    body: `Dear {{patientName}},

This is a friendly reminder that you have an appointment scheduled for tomorrow.

Doctor: Dr. {{doctorName}}
Time: {{appointmentTime}}
Clinic: {{clinicName}}

Please call {{clinicPhone}} if you need to reschedule.

Best regards,
Hospital AI CRM`,
    variables: ["patientName", "doctorName", "appointmentTime", "clinicName", "clinicPhone"],
  },
  {
    id: "3",
    name: "New Patient Welcome",
    subject: "Welcome to {{hospitalName}}",
    body: `Dear {{patientName}},

Welcome to {{hospitalName}}! We are delighted to have you as our patient.

Your patient ID: {{patientId}}

To help us serve you better, please visit our patient portal at {{patientPortalUrl}}.

If you have any questions or need assistance, our support team is here to help.

Best regards,
{{hospitalName}} Team`,
    variables: ["patientName", "hospitalName", "patientId", "patientPortalUrl"],
  },
  {
    id: "4",
    name: "Lab Report Ready",
    subject: "Your Lab Report is Ready",
    body: `Dear {{patientName}},

Your lab report is now available for download.

Report Name: {{reportName}}
Date: {{reportDate}}
Doctor: Dr. {{doctorName}}

You can download your report from your patient portal or visit our clinic.

Best regards,
Hospital AI CRM Team`,
    variables: ["patientName", "reportName", "reportDate", "doctorName"],
  },
  {
    id: "5",
    name: "Follow-up Consultation",
    subject: "Follow-up Appointment Needed",
    body: `Dear {{patientName}},

Dr. {{doctorName}} recommends a follow-up consultation to monitor your progress.

Please contact {{clinicPhone}} to schedule your appointment.

Best regards,
Hospital AI CRM Team`,
    variables: ["patientName", "doctorName", "clinicPhone"],
  },
  {
    id: "6",
    name: "Health Checkup Reminder",
    subject: "Time for Your Annual Health Checkup",
    body: `Dear {{patientName}},

It's time for your annual health checkup. Regular checkups help us keep you healthy.

Call {{clinicPhone}} to book your appointment today.

Best regards,
Hospital AI CRM Team`,
    variables: ["patientName", "clinicPhone"],
  },
  {
    id: "7",
    name: "Vaccination Reminder",
    subject: "Vaccination Reminder",
    body: `Dear {{patientName}},

Don't forget your scheduled vaccination on {{vaccinationDate}}.

Location: {{clinicName}}
Time: {{vaccinationTime}}

If you need to reschedule, please call {{clinicPhone}}.

Best regards,
Hospital AI CRM Team`,
    variables: ["patientName", "vaccinationDate", "clinicName", "vaccinationTime", "clinicPhone"],
  },
  {
    id: "8",
    name: "Appointment Cancellation",
    subject: "Appointment Cancelled",
    body: `Dear {{patientName}},

Your appointment scheduled for {{appointmentDate}} at {{appointmentTime}} with Dr. {{doctorName}} has been cancelled.

To book a new appointment, please contact {{clinicPhone}}.

Best regards,
Hospital AI CRM Team`,
    variables: ["patientName", "appointmentDate", "appointmentTime", "doctorName", "clinicPhone"],
  },
  {
    id: "9",
    name: "Thank You Message",
    subject: "Thank You for Choosing Us",
    body: `Dear {{patientName}},

Thank you for visiting {{hospitalName}}. We hope you had a great experience with us.

Your feedback is valuable. Please share your experience at {{feedbackUrl}}.

Best regards,
{{hospitalName}} Team`,
    variables: ["patientName", "hospitalName", "feedbackUrl"],
  },
  {
    id: "10",
    name: "Appointment Reschedule",
    subject: "Your Appointment Has Been Rescheduled",
    body: `Dear {{patientName}},

Your appointment has been rescheduled.

New Date: {{newDate}}
New Time: {{newTime}}
Doctor: Dr. {{doctorName}}
Location: {{clinicName}}

Please confirm your attendance by calling {{clinicPhone}}.

Best regards,
Hospital AI CRM Team`,
    variables: ["patientName", "newDate", "newTime", "doctorName", "clinicName", "clinicPhone"],
  },
];

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setVariables({});
    template.variables.forEach((v: string) => {
      setVariables((prev) => ({ ...prev, [v]: "" }));
    });
  };

  const generatePreview = () => {
    if (!selectedTemplate) return;
    let preview = selectedTemplate.body;
    Object.entries(variables).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, "g"), value as string);
    });
    setPreview(preview);
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !selectedTemplate) {
      toast.error("Please select a template and enter recipient email");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          recipientEmail,
          variables,
        }),
      });

      if (response.ok) {
        toast.success("Email sent successfully!");
        setSelectedTemplate(null);
        setRecipientEmail("");
        setVariables({});
        setPreview("");
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      toast.error("Error sending email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Templates</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Available Templates</h2>
            <div className="space-y-2">
              {EMAIL_TEMPLATES.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSelectTemplate(template)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedTemplate?.id === template.id
  ? "glass-bg border border-white/20 text-gray-900 shadow-lg"
  : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs opacity-75 mt-1">{template.variables.length} variables</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTemplate ? (
            <>
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  {selectedTemplate.name}
                </h2>

                {/* Recipient Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Variables */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Email Variables</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedTemplate.variables.map((variable: string) => (
                      <div key={variable}>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {variable}
                        </label>
                        <input
                          type="text"
                          value={variables[variable] || ""}
                          onChange={(e) =>
                            setVariables((prev) => ({
                              ...prev,
                              [variable]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${variable}`}
                          className="w-full px-4 py-2 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-6">
                  <button
                    onClick={generatePreview}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                  >
                    Generate Preview
                  </button>

                  {preview && (
                    <div className="mt-4 p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">PREVIEW</p>
                      <p className="text-sm whitespace-pre-wrap text-gray-900 dark:text-white">{preview}</p>
                    </div>
                  )}
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendEmail}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </>
          ) : (
            <div className="glass-card p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Select a template from the list to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
