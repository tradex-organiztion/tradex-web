import { NextRequest, NextResponse } from 'next/server'

const SLACK_WEBHOOK_URL = process.env.SLACK_ERROR_WEBHOOK_URL

interface ErrorReportPayload {
  timestamp: string
  userId?: string
  userEmail?: string
  pageUrl: string
  apiEndpoint: string
  method: string
  statusCode: number
  errorCode?: string
  errorMessage?: string
  stackTrace?: string
  userAgent: string
}

export async function POST(request: NextRequest) {
  // 웹훅 URL이 설정되지 않은 경우 무시
  if (!SLACK_WEBHOOK_URL) {
    console.warn('SLACK_ERROR_WEBHOOK_URL is not configured')
    return NextResponse.json({ success: false, message: 'Webhook not configured' })
  }

  try {
    const payload: ErrorReportPayload = await request.json()

    const slackMessage = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 API Error ${payload.statusCode}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*시간:*\n${payload.timestamp}`,
            },
            {
              type: 'mrkdwn',
              text: `*상태 코드:*\n${payload.statusCode}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*유저:*\n${payload.userEmail || payload.userId || '비로그인'}`,
            },
            {
              type: 'mrkdwn',
              text: `*페이지:*\n${payload.pageUrl}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*API 엔드포인트:*\n\`${payload.method} ${payload.apiEndpoint}\``,
            },
            {
              type: 'mrkdwn',
              text: `*에러 코드:*\n${payload.errorCode || 'N/A'}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*에러 메시지:*\n${payload.errorMessage || 'N/A'}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*User Agent:*\n\`${payload.userAgent}\``,
          },
        },
      ],
    }

    // Stack trace가 있으면 추가
    if (payload.stackTrace) {
      slackMessage.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Stack Trace:*\n\`\`\`${payload.stackTrace.slice(0, 2500)}\`\`\``,
        },
      })
    }

    // Slack 웹훅 호출
    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackMessage),
    })

    if (!slackResponse.ok) {
      console.error('Slack webhook failed:', await slackResponse.text())
      return NextResponse.json(
        { success: false, message: 'Failed to send to Slack' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error report failed:', error)
    return NextResponse.json(
      { success: false, message: 'Internal error' },
      { status: 500 }
    )
  }
}
