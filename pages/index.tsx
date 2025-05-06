import React from 'react';
import MainLayout from '../src/components/layout/MainLayout';

export default function HomePage() {
  return (
    <MainLayout
      title="الصفحة الرئيسية"
      description="منصة لإدارة المنح الدراسية والفرص التعليمية في مختلف أنحاء العالم"
    >
      <div className="bg-gradient-to-b from-blue-50 to-indigo-100 py-16">
        <div className="w-full max-w-5xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-8">
            منصة المنح الدراسية
          </h1>
          
          <p className="text-xl mb-12 text-gray-700 max-w-2xl mx-auto">
            منصة متكاملة لإدارة المنح الدراسية والفرص التعليمية في مختلف الجامعات والمؤسسات التعليمية حول العالم.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card">
              <h3 className="text-xl font-bold text-blue-600 mb-3">استكشاف المنح</h3>
              <p className="text-gray-600">تصفح آلاف المنح الدراسية المتاحة في مختلف الدول والتخصصات</p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-bold text-blue-600 mb-3">قصص النجاح</h3>
              <p className="text-gray-600">قصص ملهمة من الطلاب الذين حصلوا على منح دراسية وحققوا طموحاتهم</p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-bold text-blue-600 mb-3">الدعم والإرشاد</h3>
              <p className="text-gray-600">نصائح وإرشادات لمساعدتك في التقديم على المنح وزيادة فرص قبولك</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary">
              استكشاف المنح
            </button>
            <button className="btn-secondary">
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
      
      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">إحصائيات المنصة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">منحة دراسية</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">120+</div>
              <div className="text-gray-600">دولة</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">طالب مستفيد</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">قصة نجاح</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Scholarships */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">منح دراسية مميزة</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            تصفح أحدث المنح الدراسية المتاحة في مختلف التخصصات والدول
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">منحة الماجستير في جامعة هارفارد</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>الولايات المتحدة</span>
                    <span>ماجستير</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    منحة ممولة بالكامل لدراسة الماجستير في مختلف التخصصات بجامعة هارفارد
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">ممولة بالكامل</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="btn-primary">
              عرض جميع المنح
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}