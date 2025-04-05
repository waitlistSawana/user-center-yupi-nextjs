// 根据用户

import { NextResponse, NextRequest } from 'next/server'

export async function GET() { 
    return NextResponse.json({ message: 'hello' })
}