import React from 'react';
import Head from 'next/head';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <Head>
        <title>منصة المنح الدراسية - الصفحة الرئيسية</title>
        <meta name="description" content="منصة لإدارة المنح الدراسية والفرص التعليمية" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="w-full max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
          منصة المنح الدراسية
        </h1>
        
        <p className="text-xl mb-12 text-gray-700 max-w-2xl mx-auto">
          منصة متكاملة لإدارة المنح الدراسية والفرص التعليمية في مختلف الجامعات والمؤسسات التعليمية حول العالم.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-blue-600 mb-3">استكشاف المنح</h3>
            <p className="text-gray-600">تصفح آلاف المنح الدراسية المتاحة في مختلف الدول والتخصصات</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-blue-600 mb-3">قصص النجاح</h3>
            <p className="text-gray-600">قصص ملهمة من الطلاب الذين حصلوا على منح دراسية وحققوا طموحاتهم</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-blue-600 mb-3">الدعم والإرشاد</h3>
            <p className="text-gray-600">نصائح وإرشادات لمساعدتك في التقديم على المنح وزيادة فرص قبولك</p>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            استكشاف المنح
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors">
            تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}