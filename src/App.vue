<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-clip">
    <!-- Header Navbar -->
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur px-3 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-sm">
          <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
        </div>
      </div>

      <!-- Header Controls: Global Drag Mode & Aspect Ratio Switcher -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Global Drag Mode Button -->
        <button  
          type="button"
          @click="enableDrag = !enableDrag"
          class="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95"
          :class="enableDrag 
            ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-400/40 shadow-amber-500/20 font-black' 
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'"
          title="Drag Mode: Click & drag any element directly on the canvas">
          <span class="inline">Drag Mode</span>
        </button>

        <!-- Ratio Quick Switcher in Header -->
        <div class="flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            v-for="r in ['1:1', '9:16', '16:9']" 
            :key="r"
            @click="changeAspectRatio(r as any)"
            class="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
            :class="selectedRatio === r ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          >
            {{ r === '1:1' ? 'Square' : r === '9:16' ? 'Reel' : 'Youtube' }} 
          </button> 
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 p-3 sm:p-6 pb-20 lg:pb-6 max-w-[1700px] w-full mx-auto items-start lg:items-stretch">
      
      <!-- LEFT PANEL: Controls & Form (5 Cols) -->
      <section class="order-2 lg:order-1 lg:col-span-5 flex flex-col gap-4 bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm h-fit">

        <!-- TOP TABS: Question vs Settings -->
        <div class="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button 
            type="button"
            @click="activeTab = 'question'"
            class="py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeTab === 'question' 
              ? 'bg-amber-500 text-white shadow-xs font-extrabold' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'"
          >
            <span>Question</span>
          </button>
          
          <button 
            type="button"
            @click="activeTab = 'settings'"
            class="py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeTab === 'settings' 
              ? 'bg-amber-500 text-white shadow-xs font-extrabold' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'"
          >
            <span>Settings</span>
          </button>
        </div>

        <!-- TAB 1: QUESTION CONTENT (Ratio, Type, Question, Options) -->
        <div v-show="activeTab === 'question'" class="space-y-4">
          <!-- 0. Video / Image Aspect Ratio Selection -->
          <div class="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl space-y-1.5">
            <div class="grid grid-cols-3 gap-2">
              <button 
                @click="changeAspectRatio('1:1')"
                class="py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                :class="selectedRatio === '1:1' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              >
                <div>1080 × 1080</div>
                <div class="text-[10px] font-normal opacity-90">Square</div>
              </button>
              <button 
                @click="changeAspectRatio('9:16')"
                class="py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                :class="selectedRatio === '9:16' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              >
                <div>1080 × 1920</div>
                <div class="text-[10px] font-normal opacity-90">Reels</div>
              </button>
              <button 
                @click="changeAspectRatio('16:9')"
                class="py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                :class="selectedRatio === '16:9' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              >
                <div>1920 × 1080</div>
                <div class="text-[10px] font-normal opacity-90">YouTube</div>
              </button>
            </div>
          </div>

          <!-- Multi-Question Header & Add Button -->
          <div class="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Questions ({{ quizList.length }})
              </span>
            </div>
            <div class="flex items-center gap-1.5">
              <!-- Bulk JSON Import Button -->
              <button
                type="button"
                @click="openBulkJsonModal"
                class="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                title="Bulk Entry System: Paste JSON to load all questions & options at once"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                <span>Bulk Import (JSON)</span>
              </button>

              <button
                type="button"
                @click="addQuestion"
                class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                <span>Add Question</span>
              </button>
            </div>
          </div>

          <!-- All Questions Stacked Vertically (Ek ke niche ek) -->
          <div class="space-y-4">
            <div 
              v-for="(qItem, qIdx) in quizList" 
              :key="qItem.id || qIdx"
              :id="'question-card-' + qIdx"
              @click="setActiveQuestion(qIdx)"
              class="bg-white border rounded-2xl p-3.5 transition-all space-y-3 relative shadow-2xs"
              :class="activeQuestionIndex === qIdx ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-slate-300'"
            >
              <!-- Question Header (Number, Canvas Indicator, + and - buttons) -->
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <span 
                    class="w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-xs"
                    :class="activeQuestionIndex === qIdx ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'"
                  >
                    #{{ qIdx + 1 }}
                  </span>
                  <span class="text-xs font-bold text-slate-800">Question {{ qIdx + 1 }}</span>
                  <span 
                    v-if="activeQuestionIndex === qIdx" 
                    class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                  >
                    Canvas
                  </span>
                </div>

                <!-- Action Buttons: Add (+) and Delete (-) -->
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click.stop="addQuestionAfter(qIdx)"
                    class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center text-sm font-extrabold transition-all cursor-pointer active:scale-95"
                    title="Add Question Below"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    @click.stop="removeQuestion(qIdx)"
                    :disabled="quizList.length <= 1"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-extrabold transition-all cursor-pointer active:scale-95"
                    :class="quizList.length <= 1 ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'"
                    title="Delete Question"
                  >
                    −
                  </button>
                </div>
              </div>

              <!-- 1. Topic / Type -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Enter Type</label>
                <input 
                  v-model="qItem.category"
                  @focus="setActiveQuestion(qIdx)"
                  type="text" 
                  placeholder="Enter Type / Category Here"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div> 

              <!-- 2. Question -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Enter Question</label>
                <textarea 
                  v-model="qItem.question"
                  @focus="setActiveQuestion(qIdx)"
                  rows="2" 
                  placeholder="Enter Question Here"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <!-- 3. Options (A, B, C, D) & Right Answer Selector -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-[11px] font-semibold text-slate-600">Enter Options</label>
                  <span class="text-[10px] font-medium text-amber-600 select-none">Click letter to set correct</span>
                </div>

                <div 
                  v-for="(opt, optIdx) in qItem.options" 
                  :key="optIdx"
                  @click="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                  class="flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer"
                  :class="qItem.correctOption === optIdx + 1 ? 'bg-emerald-50/50 border-emerald-400 ring-1 ring-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300'"
                >
                  <!-- Left Letter Badge (A, B, C, D) with checkmark on selected -->
                  <button
                    type="button"
                    @click.stop="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                    class="w-8 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all select-none border cursor-pointer"
                    :class="qItem.correctOption === optIdx + 1 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-extrabold' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  >
                    <span v-if="qItem.correctOption === optIdx + 1" class="flex items-center gap-1 font-bold">
                      <span>✓</span><span>{{ ['A','B','C','D'][optIdx] }}</span>
                    </span>
                    <span v-else>{{ ['A','B','C','D'][optIdx] }}</span>
                  </button>

                  <!-- Option Text Input -->
                  <input 
                    v-model="qItem.options[optIdx]"
                    @focus="setActiveQuestion(qIdx)"
                    type="text" 
                    :placeholder="'Option ' + ['A','B','C','D'][optIdx]"
                    @click.stop
                    class="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 outline-none px-1"
                  />

                  <!-- Right-Side Text Button: 'Correct' when selected, 'Mark' when unselected -->
                  <button 
                    type="button"
                    @click.stop="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                    class="px-2 py-0.5 rounded-lg text-xs font-bold transition-all shrink-0 select-none cursor-pointer border active:scale-95"
                    :class="qItem.correctOption === optIdx + 1 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'"
                    :title="'Mark Option ' + ['A','B','C','D'][optIdx] + ' as Correct'"
                  >
                    {{ qItem.correctOption === optIdx + 1 ? 'Correct' : 'Mark' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DESKTOP TAB 2: SETTINGS (Fonts, Border, Font Sizes, Drag Mode, Watermark) -->
        <div v-show="activeTab === 'settings'" class="hidden lg:block space-y-4">
          <!-- 4. Typography & Layout Adjustments (With Type Font Size Slider) -->
          <div class="space-y-3">
            <!-- Google Hindi Font Selector Card -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-600">Fonts</label>
              </div>
              <button 
                type="button"
                @click="openFontModal"
                class="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400 rounded-xl transition-all cursor-pointer group shadow-2xs text-left"
              >
                <div class="flex items-center gap-3">
                  <div>
                    <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{{ currentFontDisplayName }}</span>
                    </div>
                    <div class="text-xs text-slate-500 font-medium mt-0.5" :style="{ fontFamily: style.fontFamily }">
                      सामान्य विज्ञान प्रश्नोत्तरी
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white group-hover:bg-amber-50 text-amber-600 border border-slate-200 group-hover:border-amber-300 transition-all shadow-2xs">
                  <span>Browse Fonts</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            </div>

            <!-- Color Theme (Globally Applies to Border, Type, Question, Option, Option Badge Shape) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4 4 4 0 014-4h2.586a1 1 0 00.707-.293l5.414-5.414a2 2 0 012.828 0l1.414 1.414a2 2 0 010 2.828l-5.414 5.414a1 1 0 00-.293.707V17a4 4 0 01-4 4H7z" />
                    </svg>
                    <span>Color Theme</span>
                  </span>
                  <span class="text-[10px] text-slate-500 block">Border, Type, Question, Options & Badges</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <input 
                    type="color" 
                    :value="themeColor" 
                    @input="applyThemeColor(($event.target as HTMLInputElement).value)" 
                    class="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white shadow-2xs"
                    title="Pick Any Custom Theme Color"
                  />
                </div>
              </div>

              <!-- Color Theme Presets Row -->
              <div class="flex items-center gap-1.5 pt-1 border-t border-slate-200/70 flex-wrap">
                <button
                  v-for="th in [
                    { name: 'Black', color: '#000000' },
                    { name: 'Navy', color: '#1d4ed8' },
                    { name: 'Red', color: '#dc2626' },
                    { name: 'Emerald', color: '#059669' },
                    { name: 'Amber', color: '#d97706' },
                    { name: 'Purple', color: '#7c3aed' },
                    { name: 'Rose', color: '#db2777' },
                    { name: 'Teal', color: '#0f766e' },
                    { name: 'Slate', color: '#334155' }
                  ]"
                  :key="'dt-th-' + th.color"
                  type="button"
                  @click="applyThemeColor(th.color)"
                  class="w-6 h-6 rounded-lg border transition-all cursor-pointer shadow-2xs hover:scale-105"
                  :class="themeColor.toLowerCase() === th.color.toLowerCase() ? 'ring-2 ring-amber-500 scale-110 shadow-xs' : 'border-slate-300'"
                  :style="{ backgroundColor: th.color }"
                  :title="th.name + ' (' + th.color + ')'"
                ></button>
              </div>
            </div>

            <!-- Background Config Card (Solid Color Default White or Custom Uploaded Image) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2.5">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Background</span>
                  </span>
                  <span class="text-[10px] text-slate-500 block">{{ bgConfig.type === 'image' && bgConfig.imageUrl ? 'Custom Image Active' : 'Solid Color Active' }}</span>
                </div>

                <!-- Hidden file input for BG upload -->
                <input 
                  ref="bgFileInput" 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  @change="onBgFileChange" 
                />

                <div class="flex items-center gap-1.5">
                  <button 
                    type="button" 
                    @click="bgConfig.type = 'color'" 
                    class="px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer"
                    :class="bgConfig.type === 'color' ? 'bg-amber-500 text-white border-amber-600 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                  >
                    Solid Color
                  </button>
                  <button 
                    type="button" 
                    @click="triggerBgImageUpload" 
                    class="px-2 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1"
                    :class="bgConfig.type === 'image' && bgConfig.imageUrl ? 'bg-amber-500 text-white border-amber-600 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>

              <!-- Solid Color Controls (When type === 'color') -->
              <div v-if="bgConfig.type === 'color'" class="space-y-2 pt-1 border-t border-slate-200/70">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-700">Solid Color:</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="bgConfig.color" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-white" 
                      title="Pick Custom BG Color"
                    />
                    <span class="font-mono text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ bgConfig.color }}</span>
                    <button 
                      v-if="bgConfig.color.toLowerCase() !== '#ffffff'" 
                      type="button" 
                      @click="resetBgToWhite" 
                      class="text-[10px] font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer ml-1"
                    >
                      Default White
                    </button>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 flex-wrap">
                  <button
                    v-for="bgC in [
                      { name: 'White', color: '#ffffff' },
                      { name: 'Off-White', color: '#f8fafc' },
                      { name: 'Cream', color: '#fefce8' },
                      { name: 'Soft Amber', color: '#fffbeb' },
                      { name: 'Mint', color: '#f0fdf4' },
                      { name: 'Sky', color: '#eff6ff' },
                      { name: 'Rose', color: '#fdf2f8' },
                      { name: 'Dark Slate', color: '#0f172a' }
                    ]"
                    :key="'bg-c-' + bgC.color"
                    type="button"
                    @click="bgConfig.color = bgC.color; bgConfig.type = 'color'"
                    class="w-6 h-6 rounded-lg border transition-all cursor-pointer shadow-2xs hover:scale-105"
                    :class="bgConfig.color.toLowerCase() === bgC.color.toLowerCase() ? 'ring-2 ring-amber-500 scale-110 shadow-xs' : 'border-slate-300'"
                    :style="{ backgroundColor: bgC.color }"
                    :title="bgC.name + ' (' + bgC.color + ')'"
                  ></button>
                </div>
              </div>

              <!-- Image Mode Preview & Actions -->
              <div v-else class="space-y-2 pt-1 border-t border-slate-200/70">
                <div v-if="bgConfig.imageUrl" class="flex items-center justify-between gap-3 bg-white p-2 rounded-lg border border-slate-200">
                  <div class="flex items-center gap-2 overflow-hidden">
                    <img :src="bgConfig.imageUrl" alt="BG Preview" class="w-12 h-8 object-cover rounded border border-slate-200 shrink-0" />
                    <span class="text-xs font-semibold text-slate-700 truncate">Background Image</span>
                  </div>
                  <div class="flex items-center gap-1 shrink-0">
                    <button 
                      type="button" 
                      @click="triggerBgImageUpload" 
                      class="text-[11px] font-bold text-amber-600 hover:text-amber-700 px-2 py-1 rounded bg-amber-50 cursor-pointer"
                    >
                      Change
                    </button>
                    <button 
                      type="button" 
                      @click="removeBgImage" 
                      class="text-[11px] font-bold text-rose-600 hover:text-rose-700 px-2 py-1 rounded bg-rose-50 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div v-else class="text-center py-3 bg-white rounded-lg border border-dashed border-slate-300">
                  <button 
                    type="button" 
                    @click="triggerBgImageUpload" 
                    class="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    + Upload background image from device
                  </button>
                </div>
              </div>
            </div>

            <!-- All Sliders: Single-Line Compact Rows -->
            <div class="space-y-2">
              <!-- Border Width Slider -->
              <div class="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Border Width</span>
                <input 
                  v-model.number="style.borderWidth"
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1"
                  :title="style.borderWidth + 'px'"
                  class="w-full cursor-pointer accent-amber-500"
                />
              </div>

              <!-- Type Font Size Slider -->
              <div class="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Type Size</span>
                <input 
                  v-model.number="style.typeFontSize"
                  type="range" 
                  min="24" 
                  max="68" 
                  step="2"
                  :title="style.typeFontSize + 'px'"
                  class="w-full cursor-pointer accent-amber-500"
                />
              </div>

              <!-- Question Size Slider -->
              <div class="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Question Size</span>
                <input 
                  v-model.number="style.questionFontSize"
                  type="range" 
                  min="28" 
                  max="68" 
                  step="2"
                  :title="style.questionFontSize + 'px'"
                  class="w-full cursor-pointer accent-amber-500"
                />
              </div>

              <!-- Option Text Size Slider -->
              <div class="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Option Size</span>
                <input 
                  v-model.number="style.optionFontSize"
                  type="range" 
                  min="20" 
                  max="46" 
                  step="2"
                  :title="style.optionFontSize + 'px'"
                  class="w-full cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            <!-- Option Badge Shape (5 Inbuilt Shapes: Default Circle) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700">Option Badge Shape</span>
                <span class="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 capitalize font-bold">
                  {{ style.optionShape }}
                </span>
              </div>

              <div class="grid grid-cols-5 gap-1.5">
                <button
                  v-for="shp in [
                    { id: 'circle', label: 'Circle', icon: '●' },
                    { id: 'rounded-square', label: 'Squircle', icon: '▢' },
                    { id: 'square', label: 'Square', icon: '■' },
                    { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
                    { id: 'diamond', label: 'Diamond', icon: '◆' }
                  ]"
                  :key="'desk-shp-' + shp.id"
                  type="button"
                  @click="style.optionShape = shp.id as any"
                  class="flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer text-center"
                  :class="style.optionShape === shp.id ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-102 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                >
                  <span class="text-base leading-none mb-1">{{ shp.icon }}</span>
                  <span class="text-[10px] tracking-tight">{{ shp.label }}</span>
                </button>
              </div>
            </div>

            <!-- Option Colors Customization (Text, Badge Shape Box, Badge Letter) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2.5">
              <span class="text-xs font-bold text-slate-700 block">Options Color Styling</span>
              
              <!-- 1. Option Text Color -->
              <div class="flex items-center justify-between gap-2 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg">
                <span class="text-[11px] font-semibold text-slate-700">Option Text Color</span>
                <div class="flex items-center gap-1.5">
                  <input 
                    v-model="style.optionColor" 
                    type="color" 
                    class="w-5 h-5 rounded border border-slate-300 cursor-pointer p-0 bg-white" 
                    title="Pick Custom Option Text Color"
                  />
                  <div class="flex items-center gap-1">
                    <button
                      v-for="c in ['#000000', '#1e293b', '#dc2626', '#2563eb', '#16a34a', '#d97706', '#ffffff']"
                      :key="'desk-opt-c-' + c"
                      type="button"
                      @click="style.optionColor = c"
                      class="w-4 h-4 rounded border transition-all cursor-pointer shadow-2xs hover:scale-110"
                      :class="style.optionColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 scale-110' : 'border-slate-300'"
                      :style="{ backgroundColor: c }"
                      :title="c"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- 2. Badge Box / Shape Background Color -->
              <div class="flex items-center justify-between gap-2 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg">
                <span class="text-[11px] font-semibold text-slate-700">Badge Box Color</span>
                <div class="flex items-center gap-1.5">
                  <input 
                    v-model="style.optionBadgeBgColor" 
                    type="color" 
                    class="w-5 h-5 rounded border border-slate-300 cursor-pointer p-0 bg-white" 
                    title="Pick Custom Badge Box Shape Color"
                  />
                  <div class="flex items-center gap-1">
                    <button
                      v-for="c in ['#1f2937', '#000000', '#d97706', '#dc2626', '#2563eb', '#16a34a', '#ffffff']"
                      :key="'desk-badge-bg-' + c"
                      type="button"
                      @click="style.optionBadgeBgColor = c"
                      class="w-4 h-4 rounded border transition-all cursor-pointer shadow-2xs hover:scale-110"
                      :class="style.optionBadgeBgColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 scale-110' : 'border-slate-300'"
                      :style="{ backgroundColor: c }"
                      :title="c"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- 3. Badge Letter Text Color (A, B, C, D) -->
              <div class="flex items-center justify-between gap-2 bg-white border border-slate-200/80 px-2.5 py-1.5 rounded-lg">
                <span class="text-[11px] font-semibold text-slate-700">Letter Color (A,B,C,D)</span>
                <div class="flex items-center gap-1.5">
                  <input 
                    v-model="style.optionBadgeTextColor" 
                    type="color" 
                    class="w-5 h-5 rounded border border-slate-300 cursor-pointer p-0 bg-white" 
                    title="Pick Custom Badge Letter Color"
                  />
                  <div class="flex items-center gap-1">
                    <button
                      v-for="c in ['#ffffff', '#000000', '#fef08a', '#f59e0b', '#93c5fd']"
                      :key="'desk-badge-txt-' + c"
                      type="button"
                      @click="style.optionBadgeTextColor = c"
                      class="w-4 h-4 rounded border transition-all cursor-pointer shadow-2xs hover:scale-110"
                      :class="style.optionBadgeTextColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 scale-110' : 'border-slate-300'"
                      :style="{ backgroundColor: c }"
                      :title="c"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Animation Settings (Question & Options: None [Default], Fade In, Slide Up, Typewriter) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Text Animation</span>
                </span>
                <button
                  type="button"
                  @click="testAnimationSequence"
                  class="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer flex items-center gap-1 transition-all active:scale-95"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <span>{{ isTestingAnimation ? 'Playing...' : 'Test Animation' }}</span>
                </button>
              </div>

              <!-- Question Animation Choice -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="font-bold text-slate-700">Question Animation</span>
                </div>
                <div class="grid grid-cols-4 gap-1">
                  <button
                    v-for="a in [
                      { id: 'none', label: 'None', desc: 'Default' },
                      { id: 'fade', label: 'Fade In', desc: 'Smooth' },
                      { id: 'slide-up', label: 'Slide Up', desc: 'Bottom-Up' },
                      { id: 'typewriter', label: 'Typewriter', desc: 'Word-Word' }
                    ]"
                    :key="'desk-qa-' + a.id"
                    type="button"
                    @click="style.questionAnimation = a.id as any"
                    class="py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center"
                    :class="style.questionAnimation === a.id ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-bold scale-102' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  >
                    <span class="text-[11px] leading-tight font-bold">{{ a.label }}</span>
                    <span class="text-[9px] opacity-75">{{ a.desc }}</span>
                  </button>
                </div>
              </div>

              <!-- Options Animation Choice -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="font-bold text-slate-700">Options Animation</span>
                </div>
                <div class="grid grid-cols-4 gap-1">
                  <button
                    v-for="a in [
                      { id: 'none', label: 'None', desc: 'Default' },
                      { id: 'fade', label: 'Fade In', desc: 'Smooth' },
                      { id: 'slide-up', label: 'Slide Up', desc: 'Bottom-Up' },
                      { id: 'typewriter', label: 'Typewriter', desc: 'Word-Word' }
                    ]"
                    :key="'desk-oa-' + a.id"
                    type="button"
                    @click="style.optionsAnimation = a.id as any"
                    class="py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center"
                    :class="style.optionsAnimation === a.id ? 'bg-amber-500 text-white border-amber-600 shadow-xs font-bold scale-102' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  >
                    <span class="text-[11px] leading-tight font-bold">{{ a.label }}</span>
                    <span class="text-[9px] opacity-75">{{ a.desc }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Drag Switch (Global - Drag Any Element) -->
            <div class="space-y-1.5 pt-1 border-t border-slate-100">
              <div class="flex items-center justify-between text-xs font-medium text-slate-600">
                <span class="flex items-center gap-1.5 font-bold">
                  <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V4a1.5 1.5 0 013 0v4.5m0 0a1.5 1.5 0 013 0V9a1.5 1.5 0 013 0v3.5" />
                  </svg>
                  <span>Drag Mode</span>
                </span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="enableDrag" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  <span class="ml-2 text-slate-700 text-xs font-bold">{{ enableDrag ? 'ON' : 'OFF' }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- AI Voice & TTS Engine Selection (Speechify [Default], Edge TTS, Google TTS) -->
          <div class="border-t border-slate-100 pt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Voice Engine</span>
              </h3>
            </div>

            <div class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-3">
              <!-- Provider Buttons -->
              <div class="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  @click="onVoiceProviderChange('speechify')"
                  class="py-1.5 px-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center gap-0.5"
                  :class="voiceConfig.provider === 'speechify' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-700 hover:bg-white/70'"
                >
                  <span class="text-xs">Speechify</span>
                </button>
                <button
                  type="button"
                  @click="onVoiceProviderChange('edge')"
                  class="py-1.5 px-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center gap-0.5"
                  :class="voiceConfig.provider === 'edge' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-700 hover:bg-white/70'"
                >
                  <span class="text-xs">Edge</span>
                </button> 
                <button
                  type="button"
                  @click="onVoiceProviderChange('google')"
                  class="py-1.5 px-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center gap-0.5"
                  :class="voiceConfig.provider === 'google' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-700 hover:bg-white/70'"
                >
                  <span class="text-xs">Google</span>
                </button>
              </div>

              <!-- Voice Character Selection -->
              <div class="space-y-2 bg-white/90 border border-amber-200/70 p-2.5 rounded-xl">
                <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Voice Actor</span>
                  <span class="text-[10px] text-slate-500 font-medium">{{ (voiceOptionsByProvider[voiceConfig.provider] || []).length }} Voices</span>
                </div>

                <div class="grid grid-cols-2 gap-1.5">
                  <button
                    v-for="v in (voiceOptionsByProvider[voiceConfig.provider] || [])"
                    :key="v.id"
                    type="button"
                    @click="voiceConfig.voice = v.id"
                    class="py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-left flex items-center justify-between cursor-pointer"
                    :class="voiceConfig.voice === v.id ? 'bg-amber-50 text-amber-900 border-amber-500 ring-1 ring-amber-400 font-bold' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'"
                  >
                    <span class="truncate">{{ v.name }}</span>
                    <span class="text-[9px] font-bold px-1 py-0.2 rounded shrink-0 ml-1" :class="v.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'">
                      {{ v.gender === 'Female' ? 'F' : 'M' }}
                    </span>
                  </button>
                </div>

                <!-- Test Voice Preview -->
                <div class="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span class="text-[11px] text-slate-500">Preview Voice Speech</span>
                  <button
                    type="button"
                    @click="testVoiceAudio"
                    :disabled="isPlayingAudioTest"
                    class="py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <svg v-if="!isPlayingAudioTest" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <svg v-else class="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                    <span>{{ isPlayingAudioTest ? 'Playing...' : 'Test Voice' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Stopwatch Timer Controls (Minimalist SVG Stopwatch, Default 5s, Customizable Color & Size, Draggable) -->
          <div class="border-t border-slate-100 pt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="13" r="8" stroke-width="2"/>
                  <path stroke-linecap="round" stroke-width="2" d="M12 9v4l2.5 2.5M12 5V3m-2 0h4M17 7l1.5-1.5"/>
                </svg>
                <span>Stopwatch Timer</span>
              </h3>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="timerConfig.enabled" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                <span class="ml-2 text-slate-700 text-xs font-bold">{{ timerConfig.enabled ? 'ON' : 'OFF' }}</span>
              </label>
            </div>

            <!-- Timer Settings Panel (When ON) -->
            <div v-if="timerConfig.enabled" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-3 transition-all">
              <!-- 1. Duration in Seconds & Quick Presets -->
              <div class="bg-white/90 border border-amber-200/70 p-2.5 rounded-xl space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-xs font-bold text-slate-700 shrink-0">Timer Duration</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model.number="timerConfig.duration"
                      type="number" 
                      min="1" 
                      max="60" 
                      class="w-16 px-2 py-1 text-center font-bold text-sm bg-slate-50 border border-slate-300 rounded-lg focus:border-amber-500 outline-none"
                    />
                    <span class="text-xs font-bold text-slate-500">sec</span>
                  </div>
                </div>
                <!-- Quick Preset Duration Buttons -->
                <div class="grid grid-cols-5 gap-1 pt-0.5">
                  <button
                    v-for="sec in [3, 5, 7, 10, 15]"
                    :key="'desk-tm-' + sec"
                    type="button"
                    @click="timerConfig.duration = sec"
                    class="py-1 px-1 rounded-md text-[11px] font-bold border transition-all text-center cursor-pointer"
                    :class="timerConfig.duration === sec ? 'bg-amber-500 text-white border-amber-600 shadow-2xs font-extrabold' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
                  >
                    {{ sec }}s{{ sec === 5 ? ' (Def)' : '' }}
                  </button>
                </div>
              </div>

              <!-- 2. Timer Color Picker & Presets -->
              <div class="flex items-center justify-between gap-3 bg-white/90 border border-amber-200/70 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Timer Color</span>
                <div class="flex items-center gap-2">
                  <input 
                    v-model="timerConfig.color" 
                    type="color" 
                    class="w-7 h-7 rounded-md border border-slate-300 cursor-pointer p-0 bg-white" 
                    title="Pick Any Custom Color"
                  />
                  <div class="flex items-center gap-1 flex-wrap">
                    <button
                      v-for="c in ['#000000', '#e74c3c', '#3498db', '#10b981', '#8b5cf6', '#f39c12', '#ffffff']"
                      :key="'desk-tc-' + c"
                      type="button"
                      @click="timerConfig.color = c"
                      class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs hover:scale-105"
                      :class="timerConfig.color.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 scale-110 shadow-xs' : 'border-slate-300'"
                      :style="{ backgroundColor: c }"
                      :title="c"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- 3. Timer Size Slider -->
              <div class="flex items-center justify-between gap-3 bg-white/90 border border-amber-200/70 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Timer Size</span>
                <input 
                  v-model.number="timerConfig.size"
                  type="range" 
                  min="70" 
                  max="320" 
                  step="5"
                  :title="timerConfig.size + 'px'"
                  class="w-full cursor-pointer accent-amber-500"
                />
                <span class="text-xs font-bold text-slate-600 w-10 text-right">{{ timerConfig.size }}px</span>
              </div>

              <!-- 4. Toggles: Show Digital Text & Dial White Fill -->
              <div class="grid grid-cols-2 gap-2 bg-white/90 border border-amber-200/70 p-2 rounded-xl text-xs font-medium text-slate-700">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" v-model="timerConfig.showDigital" class="rounded accent-amber-500" />
                  <span class="text-[11px] font-bold">Show Digital Sec</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" v-model="timerConfig.bgFill" class="rounded accent-amber-500" />
                  <span class="text-[11px] font-bold">White Dial Fill</span>
                </label>
              </div>

              <!-- 5. Test Live Animation & Reset Position Buttons -->
              <div class="flex items-center justify-between pt-1 gap-2">
                <button
                  type="button"
                  @click="toggleTestTimer"
                  class="py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  :class="isTestingTimer ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'"
                >
                  <svg v-if="!isTestingTimer" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  <svg v-else class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  <span>{{ isTestingTimer ? 'Stop Test' : 'Test Animation' }}</span>
                </button>

                <button
                  type="button"
                  @click="resetTimerPosition"
                  class="text-[11px] font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  Reset Position
                </button>
              </div>
            </div>
          </div>

          <!-- 6. Channel Logo Controls (SVG Emblem / Custom Image, Draggable, Recolor) -->
          <div class="border-t border-slate-100 pt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Channel Logo</span>
              </h3>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="logoConfig.enabled" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                <span class="ml-2 text-slate-700 text-xs font-bold">{{ logoConfig.enabled ? 'ON' : 'OFF' }}</span>
              </label>
            </div>

            <!-- Logo Options Panel (Shown only when ON) -->
            <div v-if="logoConfig.enabled" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-3 transition-all">
              <!-- SVG Emblem Logo Preview Banner (No Upload Button) -->
              <div class="bg-white/90 border border-amber-200/70 p-2.5 rounded-xl flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-12 h-12 rounded-lg border border-slate-300 bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 p-1" title="SVG Emblem Preview">
                    <img :src="currentLogoUrl" alt="Logo Preview" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-slate-800">SVG Emblem Logo</span>
                    <span class="text-[10px] text-slate-500">Vector Logo • Pick Any Color Below</span>
                  </div>
                </div>

               
              </div>

              <!-- Logo Color Picker (For SVG Emblem) -->
              <div class="flex items-center justify-between gap-3 bg-white/90 border border-amber-200/70 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Logo Color</span>
                <div class="flex items-center gap-1.5">
                  <input 
                    v-model="logoConfig.color" 
                    type="color" 
                    class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-white" 
                    title="Pick Custom Logo Color"
                  />
                  <div class="flex items-center gap-1">
                    <button
                      v-for="lc in ['#ffffff', '#000000', '#d97706', '#dc2626', '#2563eb', '#10b981', '#a855f7']"
                      :key="'desk-logo-col-' + lc"
                      type="button"
                      @click="logoConfig.color = lc"
                      class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs hover:scale-105"
                      :class="logoConfig.color.toLowerCase() === lc.toLowerCase() ? 'ring-2 ring-amber-500 scale-110 shadow-xs' : 'border-slate-300'"
                      :style="{ backgroundColor: lc }"
                      :title="lc"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- Logo Size Slider -->
              <div class="flex items-center justify-between gap-3 bg-white/90 border border-amber-200/70 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Logo Size</span>
                <input 
                  v-model.number="logoConfig.size"
                  type="range" 
                  min="40" 
                  max="400" 
                  step="5"
                  :title="logoConfig.size + 'px'"
                  class="w-full cursor-pointer accent-amber-500"
                />
              </div>

              <!-- Logo Opacity Slider -->
              <div class="flex items-center justify-between gap-3 bg-white/90 border border-amber-200/70 px-3 py-2 rounded-xl">
                <span class="text-xs font-bold text-slate-700 shrink-0 w-28 whitespace-nowrap">Logo Opacity</span>
                <input 
                  v-model.number="logoConfig.opacity"
                  type="range" 
                  min="0.05" 
                  max="1.0" 
                  step="0.05"
                  :title="Math.round(logoConfig.opacity * 100) + '%'" 
                  class="w-full cursor-pointer accent-amber-500"
                />
              </div>

              <!-- Reset Logo Position -->
              <div class="flex items-center justify-between pt-1">
                <span class="text-[11px] text-slate-500">Drag directly on canvas to move logo</span>
                <button
                  type="button"
                  @click="resetLogoPosition"
                  class="text-[11px] font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                >
                  Reset Logo Position
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- DESKTOP ACTION BUTTONS (Always visible at bottom of Left Panel on Desktop) -->
        <div class="hidden lg:flex border-t border-slate-100 pt-3 flex-col gap-2.5">
          <!-- Download Image & Generate Video Side-by-Side (1 Line) -->
          <div class="grid grid-cols-2 gap-2.5 w-full">
            <!-- Download Image Button -->
            <button 
              @click="downloadImage"
              type="button"
              class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Download Image</span>
            </button>

            <!-- Generate Video Button -->
            <button 
              @click="generateVideo"
              :disabled="isGeneratingVideo"
              type="button"
              class="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border shadow-md"
              :class="isGeneratingVideo 
                ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-transparent shadow-indigo-500/20'"
            >
              <svg v-if="isGeneratingVideo" class="animate-spin w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <span>{{ isGeneratingVideo ? `Generating (${videoProgress}%)` : 'Generate Video' }}</span>
            </button>
          </div>

          <!-- Video Ready Preview / Download Bar -->
          <div v-if="generatedVideoUrl" class="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl flex items-center justify-between gap-2 animate-fade-in">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Video Generated
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="playVideoModal = true"
                class="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Play Video</span>
              </button>
              <button 
                @click="downloadGeneratedVideo"
                class="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Download Video</span>
              </button>
            </div>
          </div>
        </div>

      </section> 

      <!-- RIGHT PANEL: Live Preview & Canvas (Top on Mobile, Sticky on Desktop) -->
      <div class="order-1 lg:order-2 lg:col-span-7 h-full">
        <section class="lg:sticky lg:top-20 flex flex-col items-center gap-4 bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm">
          <div class="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Preview:</span>
              <!-- Multi-Question Navigation Pills -->
              <div v-if="quizList.length > 1" class="flex items-center gap-1 overflow-x-auto py-0.5">
                <button
                  v-for="(_, idx) in quizList"
                  :key="'preview-pill-' + idx"
                  type="button"
                  @click="selectQuestionAndScroll(idx)"
                  class="px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                  :class="activeQuestionIndex === idx ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                >
                  Q{{ idx + 1 }}
                </button>
              </div>
              <span v-else class="text-[11px] font-bold text-slate-400">Question 1</span>
            </div>
            <div class="text-xs flex items-center gap-2">
              <button @click="resetPositions" class="text-slate-500 hover:text-amber-600 text-xs font-medium cursor-pointer">Reset Positions</button>
            </div>
          </div>

        <!-- Interactive Canvas Container with Dynamic Aspect Ratio -->
        <div 
          class="relative w-full max-w-[560px] overflow-hidden shadow-md border border-slate-300 bg-white flex items-center justify-center"
          :style="{ aspectRatio: selectedRatio === '9:16' ? '9/16' : selectedRatio === '16:9' ? '16/9' : '1/1', maxHeight: selectedRatio === '9:16' ? 'min(700px, calc(100vh - 170px))' : 'min(560px, calc(100vh - 170px))' }"
        >
          <canvas 
            ref="previewCanvas" 
            :width="currentDimensions.w" 
            :height="currentDimensions.h"
            class="w-full h-full object-contain select-none"
            :class="enableDrag ? (isDragging ? 'touch-none cursor-grabbing' : 'touch-none cursor-grab') : 'cursor-default'"
            @mousedown="onCanvasMouseDown"
            @mousemove="onCanvasMouseMove"
            @mouseup="onCanvasMouseUp"
            @mouseleave="onCanvasMouseUp"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchEnd"
          ></canvas>
 
          <!-- Rendering video overlay -->
          <div 
            v-if="isGeneratingVideo" 
            class="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20"
          >
            <div class="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-3"></div>
            <p class="font-bold text-lg text-white">Rendering Video...</p>
            <p class="text-xs text-slate-300 mt-1 max-w-xs font-medium">{{ currentVideoStatus }}</p>
            <div class="w-52 bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-700">
              <div class="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-200" :style="{ width: videoProgress + '%' }"></div>
            </div>
            <span class="text-xs text-amber-400 font-mono mt-1 font-bold">{{ videoProgress }}%</span>
          </div>
        </div>

        <!-- Mobile-Only Action Buttons directly below Preview Canvas -->
        <div class="w-full max-w-[560px] flex lg:hidden flex-col gap-2 pt-1">
          <!-- Download Image & Generate Video Side-by-Side (1 Line) -->
          <div class="grid grid-cols-2 gap-2 w-full">
            <!-- Download Image Button -->
            <button 
              @click="downloadImage"
              type="button"
              class="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Download Image</span>
            </button>

            <!-- Generate Video Button -->
            <button 
              @click="startBulletproofVideoGeneration"  
              :disabled="isGeneratingVideo"
              type="button"
              class="w-full py-2.5 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border shadow-md"
              :class="isGeneratingVideo ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-transparent shadow-indigo-500/20'"
            >
              <svg v-if="!isGeneratingVideo" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <svg v-else class="animate-spin w-4 h-4 shrink-0 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              <span class="truncate">{{ isGeneratingVideo ? `Generating (${videoProgress}%)` : `Generate Video` }}</span>
            </button>
          </div>

          <!-- Video Ready Controls on Mobile --> 
          <div v-if="generatedVideoUrl" class="mt-1 p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-900 flex items-center gap-1.5"> 
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Video Generated
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="playVideoModal = true"
                class="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Play Video
              </button>
              <button 
                @click="downloadVideo"
                class="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Video
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    </main>

    <!-- Mobile Fixed Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden px-4 py-2 shadow-xl flex items-center justify-around safe-bottom">
      <!-- Tab 1: Q/A -->
      <button 
        type="button"
        @click="mobileTab = 'qa'"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
        :class="mobileTab === 'qa' ? 'text-amber-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span class="text-[11px] tracking-tight">Q/A</span>
      </button>

      <!-- Tab 2: Size -->
      <button 
        type="button"
        @click="mobileTab = 'size'"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
        :class="mobileTab === 'size' ? 'text-amber-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <span class="text-[11px] tracking-tight">Size</span>
      </button>

      <!-- Tab 3: Settings -->
      <button 
        type="button"
        @click="mobileTab = 'settings'"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
        :class="mobileTab === 'settings' ? 'text-amber-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-[11px] tracking-tight">Settings</span>
      </button>
    </nav>

    <!-- Video Modal -->
    <div 
      v-if="playVideoModal && generatedVideoUrl" 
      class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-sm text-slate-800">Video Player</h3>
          <button @click="playVideoModal = false" class="text-slate-400 hover:text-slate-700 p-1 text-base cursor-pointer">✕</button>
        </div>
        <div class="p-4 bg-slate-100 flex items-center justify-center">
          <video 
            :src="generatedVideoUrl" 
            controls 
            autoplay 
            class="max-h-[500px] w-auto border border-slate-300 bg-white"
            :style="{ aspectRatio: selectedRatio === '9:16' ? '9/16' : selectedRatio === '16:9' ? '16/9' : '1/1' }"
          ></video>
        </div>
        <div class="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
          <button 
            @click="playVideoModal = false" 
            class="px-4 py-2 rounded-xl text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            Close
          </button>
          <button 
            @click="downloadVideo" 
            class="px-4 py-2 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
             Download
          </button>
        </div>
      </div>
    </div>

    <!-- Google Hindi Fonts Picker Modal -->
    <div 
      v-if="isFontModalOpen" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      @click.self="closeFontModal"
    >
      <div class="bg-white border border-slate-200 max-w-xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 class="font-bold text-sm sm:text-base text-slate-800">Hindi Fonts</h3>
            </div>
          </div>
          <button 
            type="button"
            @click="closeFontModal" 
            class="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-lg cursor-pointer transition-colors"
          >✕</button>
        </div>

        <!-- Scrollable Fonts List (One below another) -->
        <div class="flex-1 overflow-y-auto p-3 space-y-2">
          <div 
            v-if="isLoadingFonts && hindiFonts.length === 0" 
            class="py-12 flex flex-col items-center justify-center text-center text-slate-500 text-xs"
          >
            <div class="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mb-2"></div>
            Loading Hindi fonts from Google Fonts API...
          </div>

          <div 
            v-for="font in hindiFonts" 
            :key="font.family"
            @click="tempSelectedFont = font.family"
            class="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none"
            :class="tempSelectedFont === font.family 
              ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/30 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'"
          >
            <!-- Left Info & Live Hindi Preview -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {{ font.family }}
                </span>
              </div>
              
              <!-- Hindi Sample Text Rendered in this exact font! -->
              <div 
                :style="{ fontFamily: getFontCss(font.family) }" 
                class="text-base sm:text-lg font-bold text-slate-800 tracking-wide truncate"
              >
                सामान्य विज्ञान प्रश्नोत्तरी - सही उत्तर
              </div>
            </div>

            <!-- Right Selection Radio / Checkmark -->
            <div class="shrink-0 flex items-center justify-center">
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                :class="tempSelectedFont === font.family 
                  ? 'bg-amber-500 text-white shadow-xs font-bold text-xs' 
                  : 'border-2 border-slate-300 group-hover:border-slate-400'"
              >
                <span v-if="tempSelectedFont === font.family">✓</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer: Close and Apply buttons -->
        <div class="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div class="text-xs text-slate-600 truncate">
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button 
              type="button" 
              @click="closeFontModal"
              class="px-4 py-2 rounded-xl text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-all cursor-pointer active:scale-95"
            >
              Close
            </button>
            <button 
              type="button" 
              @click="applySelectedFont"
              class="px-5 py-2 rounded-xl text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Apply Font
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Toast Notification -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div 
        v-if="bulkSuccessMessage" 
        class="fixed top-20 right-4 sm:right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold"
      >
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{{ bulkSuccessMessage }}</span>
      </div>
    </transition>

    <!-- Bulk JSON Import Modal -->
    <div 
      v-if="isBulkModalOpen" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      @click.self="isBulkModalOpen = false"
    >
      <div class="bg-white border border-slate-200 max-w-2xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              { }
            </div>
            <div> 
              <h3 class="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
                <span>Bulk Import (JSON)</span>
              </h3>
            </div>
          </div>
          <button 
            type="button"
            @click="isBulkModalOpen = false" 
            class="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-base cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 space-y-3 overflow-y-auto flex-1">
          <!-- Top Tool Bar: Show Sample Button & Load Sample -->
          <div class="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/70 border border-indigo-200/60 p-2.5 rounded-xl">
            <div class="flex items-center gap-1.5 text-xs text-indigo-900 font-medium">
              <svg class="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>फॉर्मेट कैसा होना चाहिए?</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="openSamplePopup"
                class="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 rounded-lg shadow-2xs hover:bg-indigo-50 cursor-pointer flex items-center gap-1 transition-all"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Show Sample</span>
              </button>
              <button
                type="button"
                @click="copySampleJson"
                class="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-white border border-emerald-200 rounded-lg shadow-2xs hover:bg-emerald-50 cursor-pointer flex items-center gap-1 transition-all active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                <span>{{ hasCopiedSample ? 'Copied' : 'Copy Sample' }}</span>
              </button>
            </div>
          </div>

          <!-- JSON Input Textarea -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <label class="font-bold text-slate-700">Paste JSON Code Here</label>
              <button 
                v-if="bulkJsonInput.trim()" 
                type="button" 
                @click="bulkJsonInput = ''" 
                class="text-[11px] text-slate-400 hover:text-rose-600 font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
            <textarea
              v-model="bulkJsonInput"
              rows="11"
              class="w-full p-3 font-mono text-xs rounded-xl border transition-all resize-y outline-none focus:ring-2"
              :class="parsedBulkError 
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20' 
                : parsedBulkCount > 0 
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20 bg-emerald-50/10' 
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 bg-slate-50/50'"
              placeholder='[&#10;  {&#10;    "question": "वायुमंडलीय दाब मापने वाला यंत्र कौन-सा है?",&#10;    "options": {&#10;      "A": "बैरोमीटर",&#10;      "B": "थर्मामीटर",&#10;      "C": "स्पीडोमीटर",&#10;      "D": "कैलोरीमीटर"&#10;    },&#10;    "correctAnswer": "A"&#10;  }&#10;]'
            ></textarea>
          </div>

          <!-- Validation Status Banner -->
          <div v-if="parsedBulkError" class="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <div>
              <span class="font-bold">JSON Error:</span> {{ parsedBulkError }}
            </div>
          </div>
          <div v-else-if="parsedBulkCount > 0" class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="font-bold">Valid JSON: {{ parsedBulkCount }} Question(s) ready to append!</span>
            </div>
            <span class="text-[11px] text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-200 font-mono">
              Ready
            </span>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="text-xs text-slate-500">
            Ready to Append: <strong class="text-slate-800">{{ parsedBulkCount }}</strong> Questions
          </div>
          <div class="flex items-center gap-2">
            <button 
              type="button"
              @click="isBulkModalOpen = false" 
              class="px-4 py-2 rounded-xl text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button 
              type="button"
              @click="applyBulkJsonImport"
              :disabled="parsedBulkCount === 0"
              class="px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              :class="parsedBulkCount > 0 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/20 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>Append {{ parsedBulkCount > 0 ? parsedBulkCount + ' Question(s)' : '' }} to Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dedicated Sample JSON Popup Modal -->
    <div 
      v-if="isSampleModalOpen" 
      class="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      @click.self="isSampleModalOpen = false"
    >
      <div class="bg-white border border-slate-200 max-w-xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h3 class="font-bold text-sm sm:text-base text-slate-800">Sample Format</h3>
          </div>
          <button 
            type="button"
            @click="isSampleModalOpen = false" 
            class="text-slate-400 hover:text-slate-700 p-1 text-base cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div class="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
         
          <div class="relative bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto select-all shadow-inner">
            <pre>{{ SAMPLE_JSON_STRING }}</pre>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span class="text-[11px] text-slate-500">Standard Sample Format</span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="copySampleJson"
              class="px-4 py-2 rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              <span>{{ hasCopiedSample ? 'Copied' : 'Copy Sample' }}</span>
            </button>
            <button 
              type="button"
              @click="isSampleModalOpen = false" 
              class="px-3.5 py-2 rounded-xl text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { getLogoDataUri, getColoredLogoSvg } from './utils/logo-utils';

// Aspect Ratios: 1:1, 9:16, 16:9
type AspectRatio = '1:1' | '9:16' | '16:9';
const selectedRatio = ref<AspectRatio>('1:1');

// Active Tab in Left Panel on Desktop ('question' | 'settings')
const activeTab = ref<'question' | 'settings'>('question');

// Mobile Navigation State ('size' | 'qa' | 'settings')
const mobileTab = ref<'size' | 'qa' | 'settings'>('qa');
const activeSizeTarget = ref<'border' | 'type' | 'question' | 'option'>('type');

const currentDimensions = computed(() => {
  if (selectedRatio.value === '9:16') {
    return { w: 1080, h: 1920 };
  } else if (selectedRatio.value === '16:9') {
    return { w: 1920, h: 1080 };
  }
  return { w: 1080, h: 1080 };
});

async function changeAspectRatio(r: AspectRatio) {
  selectedRatio.value = r;
  resetPositions();
  await nextTick();
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

// Multi-Question Model & Persistence
export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctOption: number;
}

const savedQuizListJson = (() => {
  try {
    const raw = localStorage.getItem('quiz_multi_list');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return null;
})();

const quizList = reactive<QuizQuestion[]>(
  savedQuizListJson || [
    {
      id: 'q_default',
      category: 'सामान्य विज्ञान',
      question: 'वायुमंडलीय दाब मापने वाला यंत्र कौन-सा है?',
      options: [
        'बैरोमीटर',
        'थर्मामीटर',
        'स्पीडोमीटर',
        'कैलोरीमीटर'
      ],
      correctOption: 1
    }
  ]
);

const activeQuestionIndex = ref(0);

// Active question computed getter for convenience and backwards-compatibility
const quiz = computed(() => {
  if (activeQuestionIndex.value < 0 || activeQuestionIndex.value >= quizList.length) {
    activeQuestionIndex.value = 0;
  }
  return quizList[activeQuestionIndex.value] || quizList[0];
});

watch(
  quizList,
  (newList) => {
    try {
      localStorage.setItem('quiz_multi_list', JSON.stringify(newList));
    } catch (_) {}
  },
  { deep: true }
);

function addQuestion() {
  quizList.push({
    id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    category: quizList[quizList.length - 1]?.category || 'सामान्य विज्ञान',
    question: '',
    options: ['', '', '', ''],
    correctOption: 1
  });
  activeQuestionIndex.value = quizList.length - 1;
}

function addQuestionAfter(idx: number) {
  quizList.splice(idx + 1, 0, {
    id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    category: quizList[idx]?.category || 'सामान्य विज्ञान',
    question: '',
    options: ['', '', '', ''],
    correctOption: 1
  });
  activeQuestionIndex.value = idx + 1;
}

function removeQuestion(idx: number) {
  if (quizList.length <= 1) return;
  quizList.splice(idx, 1);
  if (activeQuestionIndex.value >= quizList.length) {
    activeQuestionIndex.value = Math.max(0, quizList.length - 1);
  }
}

let isManualScrolling = false;

function setActiveQuestion(idx: number) {
  activeQuestionIndex.value = idx;
}

function selectQuestionAndScroll(idx: number) {
  setActiveQuestion(idx);
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const targetId = isDesktop ? `question-card-${idx}` : `mob-question-card-${idx}`;
  const el = document.getElementById(targetId);
  if (el) {
    isManualScrolling = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      isManualScrolling = false;
    }, 600);
  }
}

// ----------------- BULK JSON IMPORT SYSTEM -----------------
const isBulkModalOpen = ref(false);
const isSampleModalOpen = ref(false);
const bulkJsonInput = ref('');
const hasCopiedSample = ref(false);
const bulkSuccessMessage = ref('');

const SAMPLE_JSON_STRING = JSON.stringify([
  {
    "question": "वायुमंडलीय दाब मापने वाला यंत्र कौन-सा है?",
    "options": {
      "A": "बैरोमीटर",
      "B": "थर्मामीटर",
      "C": "स्पीडोमीटर",
      "D": "कैलोरीमीटर"
    },
    "correctAnswer": "A"
  },
  {
    "question": "सौरमंडल का सबसे बड़ा ग्रह कौन-सा है?",
    "options": {
      "A": "मंगल",
      "B": "बृहस्पति",
      "C": "शनि",
      "D": "पृथ्वी"
    },
    "correctAnswer": "B"
  },
  {
    "question": "भारत का राष्ट्रीय जलीय जीव कौन-सा है?",
    "options": {
      "A": "मगरमच्छ",
      "B": "कछुआ",
      "C": "गंगा डॉल्फ़िन",
      "D": "घड़ियाल"
    },
    "correctAnswer": "C"
  }
], null, 2);

function openBulkJsonModal() {
  isBulkModalOpen.value = true;
}

function openSamplePopup() {
  isSampleModalOpen.value = true;
}

async function copySampleJson() {
  try {
    await navigator.clipboard.writeText(SAMPLE_JSON_STRING);
    hasCopiedSample.value = true;
    setTimeout(() => {
      hasCopiedSample.value = false;
    }, 2000);
  } catch (err) {
    console.warn('Copy failed:', err);
  }
}

function parseCorrectOption(ans: any): number {
  if (typeof ans === 'number' && ans >= 1 && ans <= 4) return ans;
  const str = String(ans || '').trim().toUpperCase();
  if (str === 'A' || str === '1' || str === 'ए') return 1;
  if (str === 'B' || str === '2' || str === 'बी') return 2;
  if (str === 'C' || str === '3' || str === 'सी') return 3;
  if (str === 'D' || str === '4' || str === 'डी') return 4;
  return 1;
}

const parsedBulkQuestions = computed<QuizQuestion[]>(() => {
  const raw = bulkJsonInput.value.trim();
  if (!raw) return [];
  try {
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      if (typeof parsed === 'object' && parsed !== null) {
        parsed = [parsed];
      } else {
        return [];
      }
    }

    const result: QuizQuestion[] = [];
    const baseCategory = quizList[0]?.category || 'सामान्य विज्ञान';

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i];
      if (!item || typeof item !== 'object') continue;

      const qText = String(item.question || item.q || '').trim();
      if (!qText) continue;

      let opts: string[] = [];
      if (Array.isArray(item.options)) {
        opts = item.options.map((o: any) => String(o || '').trim());
      } else if (item.options && typeof item.options === 'object') {
        const o = item.options;
        opts = [
          String(o.A ?? o.a ?? o['1'] ?? '').trim(),
          String(o.B ?? o.b ?? o['2'] ?? '').trim(),
          String(o.C ?? o.c ?? o['3'] ?? '').trim(),
          String(o.D ?? o.d ?? o['4'] ?? '').trim()
        ];
      }

      while (opts.length < 4) {
        opts.push(`Option ${String.fromCharCode(65 + opts.length)}`);
      }
      opts = opts.slice(0, 4);

      const corr = parseCorrectOption(item.correctAnswer ?? item.correctOption ?? item.answer ?? item.ans);

      result.push({
        id: 'q_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 6),
        category: String(item.category || baseCategory).trim(),
        question: qText,
        options: opts,
        correctOption: corr
      });
    }

    return result;
  } catch (_) {
    return [];
  }
});

const parsedBulkError = computed(() => {
  const raw = bulkJsonInput.value.trim();
  if (!raw) return '';
  try {
    JSON.parse(raw);
    if (parsedBulkQuestions.value.length === 0) {
      return 'JSON तो सही है, लेकिन कोई मान्य प्रश्न (question & options) नहीं मिला। "Show Sample JSON" देखें।';
    }
    return '';
  } catch (err: any) {
    return err.message || 'Invalid JSON syntax';
  }
});

const parsedBulkCount = computed(() => parsedBulkQuestions.value.length);

function applyBulkJsonImport() {
  const newQuestions = parsedBulkQuestions.value;
  if (newQuestions.length === 0) return;

  const previousCount = quizList.length;
  // If only a single empty initial question exists, replace it cleanly
  if (quizList.length === 1 && !quizList[0].question.trim()) {
    quizList.splice(0, 1, ...newQuestions);
    activeQuestionIndex.value = 0;
  } else {
    // Strictly append all questions
    quizList.push(...newQuestions);
    activeQuestionIndex.value = previousCount;
  }

  isBulkModalOpen.value = false;
  bulkJsonInput.value = '';

  bulkSuccessMessage.value = `सफलतापूर्वक ${newQuestions.length} प्रश्न जोड़े गए!`;
  setTimeout(() => {
    bulkSuccessMessage.value = '';
  }, 3500);

  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

function onWindowScroll() {
  if (isManualScrolling) return;
  // If user is actively typing in an input or textarea, don't auto-switch question
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
    return;
  }

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const prefix = isDesktop ? 'question-card-' : 'mob-question-card-';
  const targetLine = isDesktop ? 240 : 350;
  let bestIdx = activeQuestionIndex.value;
  let minDistance = Infinity;

  for (let idx = 0; idx < quizList.length; idx++) {
    const el = document.getElementById(`${prefix}${idx}`);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const cardCenter = (rect.top + rect.bottom) / 2;
    const dist = Math.abs(cardCenter - targetLine);
    if (rect.bottom > 80 && rect.top < window.innerHeight - 80) {
      if (dist < minDistance) {
        minDistance = dist;
        bestIdx = idx;
      }
    }
  }

  if (bestIdx !== activeQuestionIndex.value && bestIdx >= 0 && bestIdx < quizList.length) {
    activeQuestionIndex.value = bestIdx;
  }
}

// 5 Inbuilt Shapes for Option Letter Badge
type OptionShape = 'circle' | 'rounded-square' | 'square' | 'hexagon' | 'diamond';

export type AnimationStyle = 'none' | 'fade' | 'slide-up' | 'typewriter';

const savedStyleJson = (() => {
  try {
    const raw = localStorage.getItem('quiz_style_config');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

// Styling Model (With Type font size slider, custom colors & 5 option shapes!)
const style = reactive({
  fontFamily: savedStyleJson?.fontFamily || "'Kalam', cursive",
  typeFontSize: savedStyleJson?.typeFontSize ?? 46,       // Independent Type Font Size
  questionFontSize: savedStyleJson?.questionFontSize ?? 50,
  optionFontSize: savedStyleJson?.optionFontSize ?? 36,
  borderWidth: savedStyleJson?.borderWidth ?? 2,
  borderColor: savedStyleJson?.borderColor || '#000000',
  typeColor: savedStyleJson?.typeColor || '#000000',
  questionColor: savedStyleJson?.questionColor || '#000000',
  optionColor: savedStyleJson?.optionColor || '#000000',
  optionBadgeBgColor: savedStyleJson?.optionBadgeBgColor || '#1f2937',
  optionBadgeTextColor: savedStyleJson?.optionBadgeTextColor || '#ffffff',
  optionShape: (savedStyleJson?.optionShape as OptionShape) || 'circle',
  questionAnimation: (savedStyleJson?.questionAnimation as AnimationStyle) || 'none',
  optionsAnimation: (savedStyleJson?.optionsAnimation as AnimationStyle) || 'none'
});

// Watch style changes to auto-persist to localStorage
watch(
  style,
  (newStyle) => {
    try {
      localStorage.setItem('quiz_style_config', JSON.stringify({
        fontFamily: newStyle.fontFamily,
        typeFontSize: newStyle.typeFontSize,
        questionFontSize: newStyle.questionFontSize,
        optionFontSize: newStyle.optionFontSize,
        borderWidth: newStyle.borderWidth,
        borderColor: newStyle.borderColor,
        typeColor: newStyle.typeColor,
        questionColor: newStyle.questionColor,
        optionColor: newStyle.optionColor,
        optionBadgeBgColor: newStyle.optionBadgeBgColor,
        optionBadgeTextColor: newStyle.optionBadgeTextColor,
        optionShape: newStyle.optionShape,
        questionAnimation: newStyle.questionAnimation,
        optionsAnimation: newStyle.optionsAnimation
      }));
    } catch (_) {}
  },
  { deep: true }
);

// Global Theme Color (Applies to Border, Type, Question, Option, and Option Badge Shape)
const themeColor = ref(savedStyleJson?.questionColor || '#000000');
function applyThemeColor(color: string) {
  themeColor.value = color;
  style.borderColor = color;
  style.typeColor = color;
  style.questionColor = color;
  style.optionColor = color;
  style.optionBadgeBgColor = color;
}

// ==========================================
// GOOGLE FONTS DEVELOPER API (Devanagari/Hindi)
// ==========================================
interface HindiFontItem {
  family: string;
  category: string;
}

const GOOGLE_FONTS_API_KEY = 'AIzaSyCl9SxEXh-nqyUza8E0iyLaHSvRFWix95A';

// Fallback / Pre-cached list of 62 Google Devanagari (Hindi) fonts
const DEFAULT_HINDI_FONTS: HindiFontItem[] = [
  { family: "Kalam", category: "handwriting" },
  { family: "Poppins", category: "sans-serif" },
  { family: "Noto Sans Devanagari", category: "sans-serif" },
  { family: "Mukta", category: "sans-serif" },
  { family: "Baloo 2", category: "display" },
  { family: "Rozha One", category: "serif" },
  { family: "Yatra One", category: "display" },
  { family: "Tiro Devanagari Hindi", category: "serif" },
  { family: "Rajdhani", category: "sans-serif" },
  { family: "Hind", category: "sans-serif" },
  { family: "Teko", category: "sans-serif" },
  { family: "Khand", category: "sans-serif" },
  { family: "Martel", category: "serif" },
  { family: "Yantramanav", category: "sans-serif" },
  { family: "Biryani", category: "sans-serif" },
  { family: "Eczar", category: "serif" },
  { family: "Pragati Narrow", category: "sans-serif" },
  { family: "Amita", category: "handwriting" },
  { family: "Palanquin", category: "sans-serif" },
  { family: "Khula", category: "sans-serif" },
  { family: "Sarala", category: "sans-serif" },
  { family: "Martel Sans", category: "sans-serif" },
  { family: "Akshar", category: "sans-serif" },
  { family: "Palanquin Dark", category: "sans-serif" },
  { family: "Glegoo", category: "serif" },
  { family: "Karma", category: "serif" },
  { family: "Amiko", category: "sans-serif" },
  { family: "Halant", category: "serif" },
  { family: "Noto Serif Devanagari", category: "serif" },
  { family: "Inknut Antiqua", category: "serif" },
  { family: "Anek Devanagari", category: "sans-serif" },
  { family: "Alkatra", category: "display" },
  { family: "Kadwa", category: "serif" },
  { family: "Laila", category: "serif" },
  { family: "Cambay", category: "sans-serif" },
  { family: "Gotu", category: "sans-serif" },
  { family: "Jaldi", category: "sans-serif" },
  { family: "Modak", category: "display" },
  { family: "Kurale", category: "serif" },
  { family: "Bakbak One", category: "display" },
  { family: "Sarpanch", category: "sans-serif" },
  { family: "Sumana", category: "serif" },
  { family: "Vesper Libre", category: "serif" },
  { family: "Asar", category: "serif" },
  { family: "Arya", category: "sans-serif" },
  { family: "IBM Plex Sans Devanagari", category: "sans-serif" },
  { family: "Tiro Devanagari Sanskrit", category: "serif" },
  { family: "Sura", category: "serif" },
  { family: "Tillana", category: "display" },
  { family: "Dekko", category: "handwriting" },
  { family: "Sahitya", category: "serif" },
  { family: "Tiro Devanagari Marathi", category: "serif" },
  { family: "Rhodium Libre", category: "serif" },
  { family: "Ranga", category: "display" },
  { family: "Annapurna SIL", category: "serif" },
  { family: "Gajraj One", category: "display" },
  { family: "Jaini Purva", category: "display" },
  { family: "Playpen Sans Deva", category: "handwriting" },
  { family: "Jaini", category: "display" },
  { family: "Kripa", category: "sans-serif" },
  { family: "Matangi", category: "sans-serif" },
  { family: "Noto Sans", category: "sans-serif" }
];

const hindiFonts = ref<HindiFontItem[]>([...DEFAULT_HINDI_FONTS]);
const isFontModalOpen = ref(false);
const fontSearchQuery = ref('');
const tempSelectedFont = ref('Kalam');
const isLoadingFonts = ref(false);

const currentFontDisplayName = computed(() => {
  const match = style.fontFamily.match(/['"]([^'"]+)['"]/);
  return match ? match[1] : style.fontFamily.split(',')[0].trim();
});

const fontCategoryMap = computed(() => {
  const map: Record<string, string> = {};
  for (const f of hindiFonts.value) {
    map[f.family] = f.category === 'handwriting' ? 'cursive' : f.category === 'serif' ? 'serif' : 'sans-serif';
  }
  return map;
});

function getFontCss(family: string) {
  const cat = fontCategoryMap.value[family] || 'sans-serif';
  return `'${family}', ${cat}`;
}

const filteredHindiFonts = computed(() => {
  const q = fontSearchQuery.value.trim().toLowerCase();
  if (!q) return hindiFonts.value;
  return hindiFonts.value.filter(f => f.family.toLowerCase().includes(q));
});

function openFontModal() {
  tempSelectedFont.value = currentFontDisplayName.value;
  fontSearchQuery.value = '';
  isFontModalOpen.value = true;
  injectFontPreviewStylesheets();
  fetchGoogleFontsList();
}

function closeFontModal() {
  isFontModalOpen.value = false;
}

async function applySelectedFont() {
  const fam = tempSelectedFont.value;
  const cat = fontCategoryMap.value[fam] || 'sans-serif';
  style.fontFamily = `'${fam}', ${cat}`;
  isFontModalOpen.value = false;
  await loadGoogleFont(fam);
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

// Dynamically inject stylesheet for individual selected font
async function loadGoogleFont(family: string) {
  const id = `gfont-${family.replace(/\s+/g, '-').toLowerCase()}`;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;700;800;900&display=swap`;
    document.head.appendChild(link);
  }
  try {
    await document.fonts.load(`700 40px "${family}"`);
    await document.fonts.ready;
  } catch (err) {
    console.warn('Font load warning:', err);
  }
}

// Inject Google Fonts preview batches so each font in modal displays its real Hindi appearance
function injectFontPreviewStylesheets() {
  const families = hindiFonts.value.map(f => f.family);
  const chunkSize = 15;
  for (let i = 0; i < families.length; i += chunkSize) {
    const chunk = families.slice(i, i + chunkSize);
    const linkId = `gfonts-preview-batch-${i}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      const q = chunk.map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@700`).join('&');
      link.href = `https://fonts.googleapis.com/css2?${q}&display=swap`;
      document.head.appendChild(link);
    }
  }
}

// Fetch dynamic updates from Google Fonts API using provided key
async function fetchGoogleFontsList() {
  if (isLoadingFonts.value) return;
  isLoadingFonts.value = true;
  try {
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        const devanagariItems = data.items
          .filter((item: any) => item.subsets && item.subsets.includes('devanagari') && item.family !== 'Google Sans')
          .map((item: any) => ({
            family: item.family,
            category: item.category || 'sans-serif'
          }));
        
        if (devanagariItems.length > 0) {
          // Keep Kalam at the top since it is default
          const kalamIdx = devanagariItems.findIndex((f: any) => f.family === 'Kalam');
          if (kalamIdx > -1) {
            const [kalamItem] = devanagariItems.splice(kalamIdx, 1);
            devanagariItems.unshift(kalamItem);
          }
          hindiFonts.value = devanagariItems;
          injectFontPreviewStylesheets();
        }
      }
    }
  } catch (e) {
    console.warn('Failed to fetch from Google Fonts API, using pre-cached Devanagari fonts:', e);
  } finally {
    isLoadingFonts.value = false;
  }
}

// =============================================================================
// IndexedDB Storage Helper for High-Res Persistent Media Assets (Background & Logo)
// =============================================================================
const DB_NAME = 'QuizStudioAssetsDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_assets';

function openAssetDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in this browser'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveAssetToStorage(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openAssetDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn(`IndexedDB save error for ${key}:`, err);
    try {
      localStorage.setItem(`quiz_asset_${key}`, dataUrl);
    } catch (_) {}
  }
}

async function getAssetFromStorage(key: string): Promise<string | null> {
  try {
    const db = await openAssetDb();
    return await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        db.close();
        resolve((req.result as string) || null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch (err) {
    try {
      return localStorage.getItem(`quiz_asset_${key}`) || null;
    } catch (_) {
      return null;
    }
  }
}

async function deleteAssetFromStorage(key: string): Promise<void> {
  try {
    const db = await openAssetDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn(`IndexedDB delete error for ${key}:`, err);
  }
  try {
    localStorage.removeItem(`quiz_asset_${key}`);
  } catch (_) {}
}

// Custom Logo Model (User SVG Emblem / Uploaded Image, default ON, Recolor & Draggable)
const savedLogoConfig = (() => {
  try {
    const raw = localStorage.getItem('quiz_logo_config');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

const logoConfig = reactive({
  enabled: savedLogoConfig ? Boolean(savedLogoConfig.enabled) : true, // Default ON
  size: typeof savedLogoConfig?.size === 'number' ? savedLogoConfig.size : 160,
  opacity: typeof savedLogoConfig?.opacity === 'number' ? savedLogoConfig.opacity : 1.0,
  color: (savedLogoConfig && savedLogoConfig.color !== '#000000') ? savedLogoConfig.color : '#ffffff',
  offsetX: typeof savedLogoConfig?.offsetX === 'number' ? savedLogoConfig.offsetX : 0,
  offsetY: typeof savedLogoConfig?.offsetY === 'number' ? savedLogoConfig.offsetY : 0
});

// Watch and persist logoConfig
watch(
  logoConfig,
  (newCfg) => {
    try {
      localStorage.setItem('quiz_logo_config', JSON.stringify({
        enabled: newCfg.enabled,
        size: newCfg.size,
        opacity: newCfg.opacity,
        color: newCfg.color,
        offsetX: newCfg.offsetX,
        offsetY: newCfg.offsetY
      }));
    } catch (_) {}
    renderCanvas(-1, [1.0, 1.0, 1.0, 1.0], 0.0, false, false, 1.0);
  },
  { deep: true }
);

const currentLogoUrl = computed(() => {
  return getLogoDataUri(logoConfig.color || '#ffffff');
});

function updateLogoImageSource() {
  const targetSrc = currentLogoUrl.value;
  if (!logoImg) {
    logoImg = new Image();
  }
  logoImg.onload = () => {
    renderCanvas(-1, [1.0, 1.0, 1.0, 1.0], 0.0, false, false, 1.0);
  };
  logoImg.src = targetSrc;
}

watch(
  () => logoConfig.color,
  () => {
    updateLogoImageSource();
  }
);



// Background Model (Clean Solid White default, or custom solid color, or custom uploaded image)
const savedBgJson = (() => {
  try {
    const raw = localStorage.getItem('quiz_bg_config');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

const bgConfig = reactive({
  type: (savedBgJson?.type as 'color' | 'image') || 'color',
  color: savedBgJson?.color || '#ffffff',
  imageUrl: ''
});

watch(
  bgConfig,
  (newBg) => {
    try {
      localStorage.setItem('quiz_bg_config', JSON.stringify({
        type: newBg.type,
        color: newBg.color
      }));
    } catch (_) {}
  },
  { deep: true }
);

const bgFileInput = ref<HTMLInputElement | null>(null);
let bgImg: HTMLImageElement | null = null;

function triggerBgImageUpload() {
  if (bgFileInput.value) {
    bgFileInput.value.click();
  } else {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => onBgFileChange(e);
    input.click();
  }
}

async function onBgFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const result = event.target?.result as string;
    if (!result) return;

    await saveAssetToStorage('custom_bg', result);
    bgConfig.imageUrl = result;
    bgConfig.type = 'image';

    const img = new Image();
    img.onload = () => {
      bgImg = img;
      renderCanvas(-1, 4, 0.0, false, false, 1.0);
    };
    img.src = result;
  };
  reader.readAsDataURL(file);
  target.value = '';
}

async function removeBgImage() {
  await deleteAssetFromStorage('custom_bg');
  bgConfig.imageUrl = '';
  bgConfig.type = 'color';
  bgImg = null;
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

async function resetBgToWhite() {
  await deleteAssetFromStorage('custom_bg');
  bgConfig.color = '#ffffff';
  bgConfig.type = 'color';
  bgConfig.imageUrl = '';
  bgImg = null;
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

// Watermark (Disabled completely from video as requested)
const watermark = reactive({
  enabled: false,
  text: '',
  fontSize: 72,
  opacity: 0.16,
  rotation: -30,
  color: '#000000',
  offsetX: 0,
  offsetY: 0
});

function resetWatermarkPosition() {
  watermark.offsetX = 0;
  watermark.offsetY = 0;
  watermark.rotation = -30;
}

function resetLogoPosition() {
  logoConfig.offsetX = 0;
  logoConfig.offsetY = 0;
  renderCanvas(-1, [1.0, 1.0, 1.0, 1.0], 0.0, false, false, 1.0);
}

// ----------------- AI VOICE & TTS ENGINE CONFIGURATION -----------------
export type VoiceProvider = 'speechify' | 'edge' | 'google';

const savedVoiceJson = (() => {
  try {
    const raw = localStorage.getItem('quiz_voice_config');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

// Default provider: speechify (as explicitly requested), Default voice: mihika
const voiceConfig = reactive({
  provider: (savedVoiceJson?.provider as VoiceProvider) || 'speechify',
  voice: savedVoiceJson?.voice || 'mihika'
});

watch(
  voiceConfig,
  (newVc) => {
    try {
      localStorage.setItem('quiz_voice_config', JSON.stringify({
        provider: newVc.provider,
        voice: newVc.voice
      }));
    } catch (_) {}
  },
  { deep: true }
);

const voiceOptionsByProvider: Record<VoiceProvider, Array<{ id: string; name: string; gender: string }>> = {
  speechify: [
    { id: 'mihika', name: 'Mihika (Female)', gender: 'Female' },
    { id: 'rajiv', name: 'Rajiv (Male)', gender: 'Male' },
    { id: 'shlok', name: 'Shlok (Male)', gender: 'Male' },
    { id: 'kathan', name: 'Kathan (Male)', gender: 'Male' }
  ],
  edge: [
    { id: 'hi-IN-SwaraNeural', name: 'Swara (Female)', gender: 'Female' },
    { id: 'hi-IN-MadhurNeural', name: 'Madhur (Male)', gender: 'Male' }
  ],
  google: [
    { id: 'google-hi', name: 'Google Hindi', gender: 'Female' }
  ]
};

function onVoiceProviderChange(newProv: VoiceProvider) {
  voiceConfig.provider = newProv;
  if (newProv === 'speechify') {
    voiceConfig.voice = 'mihika';
  } else if (newProv === 'edge') {
    voiceConfig.voice = 'hi-IN-SwaraNeural';
  } else {
    voiceConfig.voice = 'google-hi';
  }
}

// Stopwatch Timer Model (Customizable duration, color, size, draggable, default 5s)
const savedTimerJson = (() => {
  try {
    const raw = localStorage.getItem('quiz_timer_config');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

const timerConfig = reactive({
  enabled: savedTimerJson?.enabled ?? true,
  duration: savedTimerJson?.duration ?? 5,
  color: savedTimerJson?.color || '#000000',
  size: savedTimerJson?.size ?? 140,
  showDigital: savedTimerJson?.showDigital ?? true,
  bgFill: savedTimerJson?.bgFill ?? true
});

watch(
  timerConfig,
  (newTc) => {
    try {
      localStorage.setItem('quiz_timer_config', JSON.stringify({
        enabled: newTc.enabled,
        duration: newTc.duration,
        color: newTc.color,
        size: newTc.size,
        showDigital: newTc.showDigital,
        bgFill: newTc.bgFill
      }));
    } catch (_) {}
  },
  { deep: true }
);

function resetTimerPosition() {
  offsets.timerX = 0;
  offsets.timerY = 0;
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

// Live interactive test animation on canvas
const isTestingTimer = ref(false);
const testTimerProgress = ref(0);
let testTimerInterval: any = null;

function toggleTestTimer() {
  if (isTestingTimer.value) {
    if (testTimerInterval) clearInterval(testTimerInterval);
    isTestingTimer.value = false;
    testTimerProgress.value = 0;
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
    return;
  }

  isTestingTimer.value = true;
  testTimerProgress.value = 0;
  const startTime = Date.now();
  const durSec = Math.max(1, timerConfig.duration || 5);
  const totalMs = durSec * 1000;

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    fetchAudioFileBuffer('/timer-sound.wav', audioCtx).then(buf => {
      if (buf) {
        const src = audioCtx.createBufferSource();
        const gain = audioCtx.createGain();
        src.buffer = buf;
        gain.gain.value = 0.85;
        src.connect(gain);
        gain.connect(audioCtx.destination);
        src.start(0);
        src.stop(audioCtx.currentTime + durSec);
      }
    });
  } catch (e) {
    console.warn(e);
  }

  testTimerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const p = Math.min(1.0, elapsed / totalMs);
    testTimerProgress.value = p;
    renderCanvas(-1, 4, p, false, true, 1.0);

    if (p >= 1.0) {
      clearInterval(testTimerInterval);
      testTimerInterval = null;
      setTimeout(() => {
        isTestingTimer.value = false;
        testTimerProgress.value = 0;
        renderCanvas(-1, 4, 0.0, false, false, 1.0);
      }, 400);
    }
  }, 1000 / 30);
}

// Positioning offsets (completely independent dragging everywhere without bounds)
const offsets = reactive({
  typeX: 0,
  typeY: 0,
  questionX: 0,
  questionY: 0,
  optionsX: 0,
  optionsY: 0,
  logoX: 0,
  logoY: 0,
  timerX: 0,
  timerY: 0
});

const enableDrag = ref(false);
type DragTarget = 'type' | 'question' | 'options' | 'logo' | 'timer';
const activeDragTarget = ref<DragTarget>('type');
const isDragging = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let initialTargetX = 0;
let initialTargetY = 0;

// Video Generation State
const isGeneratingVideo = ref(false);
const videoProgress = ref(0);
const currentVideoStatus = ref('Preparing Audio & Animation...');
const generatedVideoUrl = ref<string | null>(null);
const playVideoModal = ref(false);
const isPlayingAudioTest = ref(false);
const isPlayingSfxTest = ref(false);

const previewCanvas = ref<HTMLCanvasElement | null>(null);

// Preloaded Assets
let logoImg: HTMLImageElement | null = null;

function waitForImg(img: HTMLImageElement | null): Promise<void> {
  if (!img) return Promise.resolve();
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const onDone = () => resolve();
    img.addEventListener('load', onDone, { once: true });
    img.addEventListener('error', onDone, { once: true });
    setTimeout(onDone, 800);
  });
}


// ----------------- INTERACTIVE ANIMATION TEST RUNNER -----------------
const isTestingAnimation = ref(false);
let animTestTimer: any = null;

function testAnimationSequence() {
  if (isTestingAnimation.value) {
    if (animTestTimer) clearInterval(animTestTimer);
    isTestingAnimation.value = false;
    renderCanvas(1.0, [1.0, 1.0, 1.0, 1.0], 0.0, false, false, 1.0);
    return;
  }

  isTestingAnimation.value = true;
  const startTs = performance.now();
  const totalDurationMs = 3200; // 3.2 seconds total animation sequence

  if (animTestTimer) clearInterval(animTestTimer);

  animTestTimer = setInterval(() => {
    const elapsed = performance.now() - startTs;
    const progress = elapsed / totalDurationMs;

    if (progress >= 1.0) {
      clearInterval(animTestTimer);
      isTestingAnimation.value = false;
      renderCanvas(1.0, [1.0, 1.0, 1.0, 1.0], 0.0, false, false, 1.0);
      return;
    }

    // 1. Question Animation Progress: 0s to 1.0s
    let qP = 1.0;
    if (style.questionAnimation !== 'none') {
      qP = Math.min(1.0, Math.max(0.0, elapsed / 1000));
    }

    // 2. Options Animation Progress: Staggered from 0.8s to 2.4s
    let optsP = [1.0, 1.0, 1.0, 1.0];
    if (style.optionsAnimation !== 'none') {
      const optStarts = [800, 1200, 1600, 2000];
      const optDur = 500;
      optsP = optStarts.map(st => Math.min(1.0, Math.max(0.0, (elapsed - st) / optDur)));
    }

    // 3. Answer Reveal towards end: 2.5s onwards
    const isRevealed = elapsed >= 2500;
    let pulse = 1.0;
    if (isRevealed) {
      const revElapsed = (elapsed - 2500) / 1000;
      if (revElapsed < 0.7) {
        pulse = 1.0 + 0.05 * Math.sin(revElapsed * Math.PI * 4);
      }
    }

    renderCanvas(qP, optsP, 0.0, isRevealed, false, pulse);
  }, 1000 / 60);
}

onMounted(async () => {
  // Listen for window scroll to synchronize preview with questions
  window.addEventListener('scroll', onWindowScroll, { passive: true });
  window.addEventListener('mousemove', onWindowMouseMove);
  window.addEventListener('mouseup', onWindowMouseUp);

  // 0. Render canvas IMMEDIATELY on first frame so it is NEVER blank on page load or reload
  await nextTick();
  renderCanvas(-1, 4, 0.0, false, false, 1.0);

  // 1. Initialize SVG Channel Logo
  try {
    await deleteAssetFromStorage('custom_logo');
  } catch (_) {}
  updateLogoImageSource();

  // 1.5 Restore Custom Background if previously saved in IndexedDB
  const savedBg = await getAssetFromStorage('custom_bg');
  if (savedBg) {
    bgConfig.imageUrl = savedBg;
    bgConfig.type = 'image';
    bgImg = new Image();
    bgImg.src = savedBg;
  }

  // Safely wait for logo, background & fonts without blocking or hanging
  await Promise.allSettled([
    waitForImg(logoImg),
    waitForImg(bgImg),
    Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 1000))
    ])
  ]);

  // Re-render once images and fonts are loaded
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll);
  window.removeEventListener('mousemove', onWindowMouseMove);
  window.removeEventListener('mouseup', onWindowMouseUp);
});

// Watch inputs to re-render in real-time
watch(
  [quizList, activeQuestionIndex, style, offsets, watermark, logoConfig, timerConfig, bgConfig, selectedRatio],
  async () => {
    await nextTick();
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
  },
  { deep: true }
);

function resetToExactSample() {
  quizList.splice(0, quizList.length, {
    id: 'q_default',
    category: 'सामान्य विज्ञान',
    question: 'वायुमंडलीय दाब मापने वाला यंत्र कौन-सा है?',
    options: [
      'बैरोमीटर',
      'थर्मामीटर',
      'स्पीडोमीटर',
      'कैलोरीमीटर'
    ],
    correctOption: 1
  });
  activeQuestionIndex.value = 0;
  style.typeFontSize = 46;
  style.questionFontSize = 50;
  style.optionFontSize = 36;
  style.borderWidth = 4;
  style.borderColor = '#000000';
  style.typeColor = '#000000';
  style.questionColor = '#000000';
  style.optionColor = '#000000';
  style.optionBadgeBgColor = '#1f2937';
  style.optionBadgeTextColor = '#ffffff';
  style.optionShape = 'circle';
  themeColor.value = '#000000';
  resetBgToWhite();
  resetPositions();
}

function resetPositions() {
  offsets.typeX = 0;
  offsets.typeY = 0;
  offsets.questionX = 0;
  offsets.questionY = 0;
  offsets.optionsX = 0;
  offsets.optionsY = 0;
  offsets.logoX = 0;
  offsets.logoY = 0;
  offsets.timerX = 0;
  offsets.timerY = 0;
  watermark.offsetX = 0;
  watermark.offsetY = 0;
  watermark.rotation = -30;
  logoConfig.offsetX = 0;
  logoConfig.offsetY = 0;
}

// ----------------- MULTI-ENGINE TTS AUDIO GENERATOR (Speechify [Default], Edge TTS, Google) -----------------
async function fetchTtsAudioBuffer(text: string, audioCtx: AudioContext): Promise<{ buffer: AudioBuffer, duration: number }> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      provider: voiceConfig.provider,
      voice: voiceConfig.voice,
      lang: 'hi'
    })
  });

  if (!res.ok) {
    throw new Error(`TTS server responded with ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return {
    buffer: audioBuffer,
    duration: audioBuffer.duration
  };
}

// Quick Audio Test
async function testVoiceAudio() {
  if (isPlayingAudioTest.value) return;
  isPlayingAudioTest.value = true;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const curQ = quizList[activeQuestionIndex.value] || quizList[0];
    const testText = `${curQ.question || 'प्रश्न'}`;
    const { buffer } = await fetchTtsAudioBuffer(testText, audioCtx);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
    source.onended = () => {
      isPlayingAudioTest.value = false;
    };
  } catch (err) {
    console.error(err);
    alert('Voice test failed: ' + err);
    isPlayingAudioTest.value = false;
  }
}

// Helper: Fetch and decode static audio asset file
async function fetchAudioFileBuffer(url: string, audioCtx: AudioContext): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn(`Could not load audio asset ${url}:`, err);
    return null;
  }
}

// Quick SFX Test (Plays 3s of Timer Sound followed immediately by Correct Answer Sound)
async function testSfxAudio() {
  if (isPlayingSfxTest.value) return;
  isPlayingSfxTest.value = true;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    const [timerBuf, corrBuf] = await Promise.all([
      fetchAudioFileBuffer('/timer-sound.wav', audioCtx),
      fetchAudioFileBuffer('/correct-answer-sound.wav', audioCtx)
    ]);

    if (timerBuf) {
      const srcTimer = audioCtx.createBufferSource();
      const gainTimer = audioCtx.createGain();
      srcTimer.buffer = timerBuf;
      gainTimer.gain.value = 0.85;
      srcTimer.connect(gainTimer);
      gainTimer.connect(audioCtx.destination);
      srcTimer.start(0);
      srcTimer.stop(audioCtx.currentTime + 3.0);
    }

    setTimeout(() => {
      if (corrBuf) {
        const srcCorr = audioCtx.createBufferSource();
        const gainCorr = audioCtx.createGain();
        srcCorr.buffer = corrBuf;
        gainCorr.gain.value = 0.95;
        srcCorr.connect(gainCorr);
        gainCorr.connect(audioCtx.destination);
        srcCorr.start(0);
        srcCorr.onended = () => {
          isPlayingSfxTest.value = false;
        };
      } else {
        isPlayingSfxTest.value = false;
      }
    }, 3100);
  } catch (err) {
    console.error(err);
    isPlayingSfxTest.value = false;
  }
}

// Helper: Smart Wrap text on canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth) {
      if (currentLine !== '') {
        lines.push(currentLine);
        if (ctx.measureText(word).width > maxWidth) {
          let subWord = '';
          for (const char of word) {
            if (ctx.measureText(subWord + char).width > maxWidth) {
              lines.push(subWord);
              subWord = char;
            } else {
              subWord += char;
            }
          }
          currentLine = subWord;
        } else {
          currentLine = word;
        }
      } else {
        let subWord = '';
        for (const char of word) {
          if (ctx.measureText(subWord + char).width > maxWidth) {
            lines.push(subWord);
            subWord = char;
          } else {
            subWord += char;
          }
        }
        currentLine = subWord;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Helper: Draw rounded pill rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Minimalist SVG Stopwatch Timer
 * Faithfully replicates the provided SVG analog stopwatch with rotating hand,
 * thick/thin ticks, buttons, and digital countdown display.
 */
function drawStopwatchTimer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  progress: number, // 0.0 (start) to 1.0 (end)
  totalDuration: number,
  showDigital: boolean = true,
  bgFill: boolean = true
) {
  ctx.save();
  ctx.translate(x, y);

  // SVG coordinate base is 200 x 200 (center of clock dial is at 100, 105)
  const scale = size / 200;
  ctx.scale(scale, scale);

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Optional clean circular background fill so clock is legible over any backdrop
  if (bgFill) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(100, 105, 84, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.restore();
  }

  // 2. Top Button
  // <rect x="85" y="0" width="30" height="15" fill="currentColor" rx="3"/>
  roundRect(ctx, 85, 0, 30, 15, 3);
  ctx.fill();
  // <rect x="90" y="12" width="20" height="15" fill="currentColor"/>
  ctx.fillRect(90, 12, 20, 15);

  // 3. Side Button
  // <rect x="150" y="25" width="15" height="25" fill="currentColor" rx="3" transform="rotate(35 150 25)"/>
  ctx.save();
  ctx.translate(150, 25);
  ctx.rotate((35 * Math.PI) / 180);
  roundRect(ctx, 0, 0, 15, 25, 3);
  ctx.fill();
  ctx.restore();

  // 4. Outer Circle
  // <circle cx="100" cy="105" r="85" fill="none" stroke="currentColor" stroke-width="8"/>
  ctx.beginPath();
  ctx.arc(100, 105, 85, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.stroke();

  // 5. Tick Marks - 12, 3, 6, 9 (Thick: stroke-width="6")
  ctx.lineWidth = 6;
  // 12
  ctx.beginPath(); ctx.moveTo(100, 30); ctx.lineTo(100, 45); ctx.stroke();
  // 3
  ctx.beginPath(); ctx.moveTo(165, 105); ctx.lineTo(150, 105); ctx.stroke();
  // 6
  ctx.beginPath(); ctx.moveTo(100, 180); ctx.lineTo(100, 165); ctx.stroke();
  // 9
  ctx.beginPath(); ctx.moveTo(35, 105); ctx.lineTo(50, 105); ctx.stroke();

  // 6. Other Ticks - 1, 2, 4, 5, 7, 8, 10, 11 (Thin: stroke-width="4")
  ctx.lineWidth = 4;
  // 1
  ctx.beginPath(); ctx.moveTo(132, 40); ctx.lineTo(125, 53); ctx.stroke();
  // 2
  ctx.beginPath(); ctx.moveTo(155, 60); ctx.lineTo(143, 70); ctx.stroke();
  // 4
  ctx.beginPath(); ctx.moveTo(170, 132); ctx.lineTo(155, 125); ctx.stroke();
  // 5
  ctx.beginPath(); ctx.moveTo(150, 155); ctx.lineTo(140, 143); ctx.stroke();
  // 7
  ctx.beginPath(); ctx.moveTo(50, 155); ctx.lineTo(60, 143); ctx.stroke();
  // 8
  ctx.beginPath(); ctx.moveTo(30, 132); ctx.lineTo(45, 125); ctx.stroke();
  // 10
  ctx.beginPath(); ctx.moveTo(45, 60); ctx.lineTo(57, 70); ctx.stroke();
  // 11
  ctx.beginPath(); ctx.moveTo(68, 40); ctx.lineTo(75, 53); ctx.stroke();

  // 7. Center Dot
  // <circle cx="100" cy="105" r="10" fill="currentColor"/>
  ctx.beginPath();
  ctx.arc(100, 105, 10, 0, Math.PI * 2);
  ctx.fill();

  // 8. Moving Hand (Starts pointing at 12 o'clock, rotates clockwise 360deg)
  // Origin: 100, 105; Hand endpoint at 0deg is (100, 35) -> delta is (0, -70)
  const clampedP = Math.max(0.0, Math.min(1.0, progress));
  const angleDeg = clampedP * 360;
  ctx.save();
  ctx.translate(100, 105);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -70);
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.restore();

  // 9. Digital Time Display (below stopwatch)
  if (showDigital) {
    const remaining = Math.max(0, totalDuration * (1 - clampedP));
    const timeText = remaining.toFixed(1) + 's';
    ctx.font = '600 32px "Poppins", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
    ctx.fillText(timeText, 100, 204);
  }

  ctx.restore();
}

// Helper: Draw 5 Inbuilt Shapes for Option Letter Badge (Circle, Squircle, Square, Hexagon, Diamond)
function drawOptionShape(
  ctx: CanvasRenderingContext2D,
  shape: OptionShape,
  cx: number,
  cy: number,
  size: number
) {
  const r = size / 2;
  ctx.beginPath();
  switch (shape) {
    case 'circle': {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    }
    case 'rounded-square': {
      const x = cx - r;
      const y = cy - r;
      const cornerR = r * 0.35;
      roundRect(ctx, x, y, size, size, cornerR);
      break;
    }
    case 'square': {
      const x = cx - r;
      const y = cy - r;
      ctx.rect(x, y, size, size);
      break;
    }
    case 'hexagon': {
      for (let s = 0; s < 6; s++) {
        const angle = (s * Math.PI) / 3 - Math.PI / 6;
        const hx = cx + r * Math.cos(angle);
        const hy = cy + r * Math.sin(angle);
        if (s === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      break;
    }
    case 'diamond': {
      const dr = r * 1.05;
      ctx.moveTo(cx, cy - dr);
      ctx.lineTo(cx + dr, cy);
      ctx.lineTo(cx, cy + dr);
      ctx.lineTo(cx - dr, cy);
      ctx.closePath();
      break;
    }
    default: {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    }
  }
}

// Helper: Normalize options progress (supports number[] or legacy count number 0..4)
function normalizeOptsProgress(opts: number[] | number | undefined): number[] {
  if (Array.isArray(opts)) return opts;
  const count = typeof opts === 'number' ? opts : 4;
  return [0, 1, 2, 3].map((i) => (i < count ? 1.0 : 0.0));
}

/**
 * Core render routine to any CanvasRenderingContext2D
 */
function renderCanvasToCtx(
  ctx: CanvasRenderingContext2D,
  targetCanvas: HTMLCanvasElement,
  questionAnimProgress: number = 1.0,
  optsProgress: number[] | number = [1.0, 1.0, 1.0, 1.0],
  animProgress: number = 0.0,
  revealCorrect: boolean = false,
  showTimer: boolean = false,
  pulseScale: number = 1.0,
  targetQuiz?: QuizQuestion,
  isExport: boolean = false
) {
  const W = targetCanvas.width;
  const H = targetCanvas.height;
  const curQuiz = targetQuiz || quizList[activeQuestionIndex.value] || quizList[0];

  // Scale references based on height & width
  const isReel = selectedRatio.value === '9:16';
  const isLandscape = selectedRatio.value === '16:9';

  // 1. Canvas Background (Solid Color default White, or custom uploaded image)
  if (bgConfig.type === 'image' && bgConfig.imageUrl) {
    if (!bgImg || bgImg.src !== bgConfig.imageUrl) {
      bgImg = new Image();
      bgImg.onload = () => {
        renderCanvas(-1, 4, 0.0, false, false, 1.0);
      };
      bgImg.src = bgConfig.imageUrl;
    }
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      // Draw background image covering entire canvas without distortion
      const canvasAspect = W / H;
      const imgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
      let sWidth = bgImg.naturalWidth;
      let sHeight = bgImg.naturalHeight;
      let sx = 0;
      let sy = 0;
      if (imgAspect > canvasAspect) {
        sWidth = bgImg.naturalHeight * canvasAspect;
        sx = (bgImg.naturalWidth - sWidth) / 2;
      } else {
        sHeight = bgImg.naturalWidth / canvasAspect;
        sy = (bgImg.naturalHeight - sHeight) / 2;
      }
      ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, W, H);
    } else {
      ctx.fillStyle = bgConfig.color || '#ffffff';
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    ctx.fillStyle = bgConfig.color || '#ffffff';
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Outer Frame Border (Drawn with style.borderColor if borderWidth > 0)
  const bw = Math.max(0, style.borderWidth);
  if (bw > 0) {
    ctx.lineWidth = bw;
    ctx.strokeStyle = style.borderColor || '#000000';
    ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);
  }

  // 2.5 Channel Logo (SVG Emblem / Custom Image, default ON, draggable, customizable color)
  if (logoConfig.enabled) {
    if (!logoImg) {
      updateLogoImageSource();
    }
    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0.01, Math.min(1.0, logoConfig.opacity));
      const maxDim = logoConfig.size || 160;
      const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
      let lW = maxDim;
      let lH = maxDim;
      if (aspect > 1) {
        lW = maxDim;
        lH = maxDim / aspect;
      } else {
        lH = maxDim;
        lW = maxDim * aspect;
      }
      // Default top-right position
      const defLogoX = W - lW - 64;
      const defLogoY = isReel ? 110 : isLandscape ? 35 : 45;
      const logoX = defLogoX + logoConfig.offsetX;
      const logoY = defLogoY + logoConfig.offsetY;
      ctx.drawImage(logoImg, logoX, logoY, lW, lH);

      // Active Drag indicator outline (Editor only, never in video or poster export)
      if (!isExport && enableDrag.value && activeDragTarget.value === 'logo') {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        roundRect(ctx, logoX - 4, logoY - 4, lW + 8, lH + 8, 8);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  // 3. Top-Left Category (Type Heading) - Independent Dragging Anywhere!
  const categoryText = (curQuiz.category || 'सामान्य विज्ञान').trim();
  const typeBaseX = 64 + offsets.typeX;
  const typeBaseY = (isReel ? 120 : isLandscape ? 40 : 55) + offsets.typeY;

  ctx.save();
  ctx.fillStyle = style.typeColor || '#000000';
  ctx.font = `700 ${style.typeFontSize}px ${style.fontFamily}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(categoryText, typeBaseX, typeBaseY);
  ctx.restore();



  // 5. Question Section with Configurable Animation (None, Fade In, Slide Up, Typewriter)
  const questionBaseX = W / 2 + offsets.questionX;
  const questionBaseY = (isReel ? 420 : isLandscape ? 180 : 220) + offsets.questionY;
  const questionMaxW = isLandscape ? 1600 : 920;

  const fullQuestion = curQuiz.question || 'प्रश्न यहाँ दिखाई देगा...';
  const qLineHeight = style.questionFontSize * 1.32;

  const qAnim = style.questionAnimation || 'none';
  const qP = questionAnimProgress < 0 ? 1.0 : Math.max(0.0, Math.min(1.0, questionAnimProgress));

  let qTextToRender = fullQuestion;
  let qOpacity = 1.0;
  let qTranslateY = 0;

  if (qAnim === 'none' || qP >= 1.0) {
    qTextToRender = fullQuestion;
    qOpacity = 1.0;
  } else if (qAnim === 'fade') {
    qTextToRender = fullQuestion;
    qOpacity = qP * qP * (3 - 2 * qP);
  } else if (qAnim === 'slide-up') {
    qTextToRender = fullQuestion;
    const ease = 1 - Math.pow(1 - qP, 3);
    qTranslateY = (1 - ease) * 50;
    qOpacity = Math.min(1.0, qP * 1.5);
  } else if (qAnim === 'typewriter') {
    const words = fullQuestion.trim().split(/\s+/);
    const visibleWordsCount = Math.max(1, Math.min(words.length, Math.ceil(qP * words.length)));
    qTextToRender = words.slice(0, visibleWordsCount).join(' ');
    qOpacity = 1.0;
  }

  if (qOpacity > 0.01) {
    ctx.save();
    ctx.globalAlpha = qOpacity;
    ctx.fillStyle = style.questionColor || '#000000';
    ctx.font = `700 ${style.questionFontSize}px ${style.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const qLines = wrapText(ctx, qTextToRender, questionMaxW);
    for (let i = 0; i < qLines.length; i++) {
      ctx.fillText(qLines[i], questionBaseX, questionBaseY + qTranslateY + (i * qLineHeight));
    }
    ctx.restore();
  }

  // 6. Minimalist SVG Stopwatch Timer:
  // In video export: STRICTLY show ONLY during active countdown time (showTimer === true). Never before, never after!
  // In live editor: Only show during countdown test or when Drag Mode is actively enabled to reposition it.
  const shouldRenderTimer = timerConfig.enabled && (
    isExport 
      ? Boolean(showTimer) 
      : Boolean(showTimer || isTestingTimer.value || enableDrag.value)
  );
  if (shouldRenderTimer) {
    const timerSize = timerConfig.size || 140;
    const defTimerX = (W - timerSize) / 2;
    const defTimerY = isReel ? 630 : isLandscape ? 280 : 310;
    const finalTimerX = defTimerX + offsets.timerX;
    const finalTimerY = defTimerY + offsets.timerY;

    // Use current animProgress during video/test, or 0.0 in static preview
    const effectiveProgress = (showTimer || isTestingTimer.value) ? animProgress : 0.0;

    drawStopwatchTimer(
      ctx,
      finalTimerX,
      finalTimerY,
      timerSize,
      timerConfig.color || '#000000',
      effectiveProgress,
      timerConfig.duration || 5,
      timerConfig.showDigital !== false,
      timerConfig.bgFill !== false
    );

    // Active Drag indicator outline (Editor only, never in video or poster export)
    if (!isExport && enableDrag.value && activeDragTarget.value === 'timer') {
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      const totalH = timerSize * (timerConfig.showDigital !== false ? 1.25 : 1.0);
      roundRect(ctx, finalTimerX - 8, finalTimerY - 8, timerSize + 16, totalH + 16, 12);
      ctx.stroke();
      ctx.restore();
    }
  }

  // 7. Four Options with Canva Pan Animation (Slide in from Left →) & Shape Badge
  const optW = isLandscape ? 1400 : 910;
  const optX = (W - optW) / 2 + offsets.optionsX;
  const optGap = isReel ? 28 : isLandscape ? 16 : 16;
  const optionsStartY = (isReel ? 780 : isLandscape ? 400 : 430) + offsets.optionsY;
  const letters = ['A', 'B', 'C', 'D'];

  const shapeSize = isReel ? 68 : isLandscape ? 58 : 64;
  const shapeMarginLeft = 14;
  const textStartX = optX + shapeMarginLeft + shapeSize + (isReel ? 26 : 20);
  const maxTextAvailableWidth = optW - (shapeMarginLeft + shapeSize + 40);

  ctx.font = `700 ${style.optionFontSize}px ${style.fontFamily}`;

  const normalizedOpts = normalizeOptsProgress(optsProgress);

  let currentY = optionsStartY;

  for (let i = 0; i < 4; i++) {
    const panP = normalizedOpts[i] !== undefined ? normalizedOpts[i] : 1.0;
    const optionText = curQuiz.options[i] || `Option ${letters[i]}`;
    
    const optLines = wrapText(ctx, optionText, maxTextAvailableWidth);
    const lineH = style.optionFontSize * 1.25;
    
    const contentH = optLines.length * lineH;
    const optH = Math.max(isReel ? 84 : 72, contentH + 24);

    const isCorrect = (curQuiz.correctOption === i + 1);
    const isHighlighted = revealCorrect && isCorrect;

    const optAnim = style.optionsAnimation || 'none';
    let optTextToRender = optionText;
    let optOpacity = 1.0;
    let optTranslateY = 0;

    if (optAnim === 'none' || panP >= 1.0) {
      optTextToRender = optionText;
      optOpacity = 1.0;
    } else if (optAnim === 'fade') {
      optTextToRender = optionText;
      optOpacity = panP * panP * (3 - 2 * panP);
    } else if (optAnim === 'slide-up') {
      optTextToRender = optionText;
      const ease = 1 - Math.pow(1 - panP, 3);
      optTranslateY = (1 - ease) * 40;
      optOpacity = Math.min(1.0, panP * 1.5);
    } else if (optAnim === 'typewriter') {
      const words = optionText.trim().split(/\s+/);
      const visibleWordsCount = Math.max(1, Math.min(words.length, Math.ceil(panP * words.length)));
      optTextToRender = words.slice(0, visibleWordsCount).join(' ');
      optOpacity = Math.min(1.0, panP * 2.0);
    }

    if (optOpacity > 0.01) {
      ctx.save();
      ctx.globalAlpha = optOpacity;

      if (optTranslateY !== 0) {
        ctx.translate(0, optTranslateY);
      }

      if (isHighlighted) {
        const cx = optX + optW / 2;
        const cy = currentY + optH / 2;
        ctx.translate(cx, cy);
        ctx.scale(pulseScale, pulseScale);
        ctx.translate(-cx, -cy);
      }

      // Draw Option Shape (Circle [default], Squircle, Square, Hexagon, Diamond)
      const shapeCenterX = optX + shapeMarginLeft + shapeSize / 2;
      const shapeCenterY = currentY + optH / 2;

      ctx.save();
      const badgeBgColor = isHighlighted ? '#16a34a' : (style.optionBadgeBgColor || '#1f2937');
      ctx.fillStyle = badgeBgColor;
      drawOptionShape(ctx, style.optionShape || 'circle', shapeCenterX, shapeCenterY, shapeSize);
      ctx.fill();

      // Shape Letter (A, B, C, D)
      const badgeTextColor = isHighlighted ? '#ffffff' : (style.optionBadgeTextColor || '#ffffff');
      ctx.fillStyle = badgeTextColor;
      ctx.font = `800 ${isReel ? 30 : 26}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letters[i], shapeCenterX, shapeCenterY + 1);
      ctx.restore();

      // Render Option Name / Text (Aligned cleanly to left, customizable color)
      ctx.fillStyle = isHighlighted ? '#15803d' : (style.optionColor || '#000000');
      ctx.font = `${isHighlighted ? '800' : '700'} ${style.optionFontSize}px ${style.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const renderLines = wrapText(ctx, optTextToRender, maxTextAvailableWidth);
      const startTextY = currentY + (optH - (optLines.length - 1) * lineH) / 2;
      for (let l = 0; l < renderLines.length; l++) {
        ctx.fillText(renderLines[l], textStartX, startTextY + l * lineH);
      }

      ctx.restore();
    }

    currentY += optH + optGap;
  }
}

/**
 * Main render function for canvas preview
 */
function renderCanvas(
  questionAnimProgress: number = 1.0,
  optsProgress: number[] | number = [1.0, 1.0, 1.0, 1.0],
  animProgress: number = 0.0,
  revealCorrect: boolean = false,
  showTimer: boolean = false,
  pulseScale: number = 1.0
) {
  const canvas = previewCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  renderCanvasToCtx(
    ctx,
    canvas,
    questionAnimProgress,
    optsProgress,
    animProgress,
    revealCorrect,
    showTimer,
    pulseScale
  );
}

// ----------------- TARGETED DRAG AND DROP (GLOBAL - ANY ELEMENT DIRECTLY) -----------------
function getCanvasCoords(clientX: number, clientY: number): { x: number; y: number } | null {
  const canvas = previewCanvas.value;
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  const scaleX = currentDimensions.value.w / rect.width;
  const scaleY = currentDimensions.value.h / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

/**
 * Computes bounding boxes for all active draggable elements on canvas.
 */
function getElementBoxes(coords?: { x: number; y: number }) {
  const canvas = previewCanvas.value;
  const W = currentDimensions.value.w;
  const H = currentDimensions.value.h;
  const isReel = selectedRatio.value === '9:16';
  const isLandscape = selectedRatio.value === '16:9';
  const curQuiz = quizList[activeQuestionIndex.value] || quizList[0] || { category: '', question: '', options: [] };
  const ctx = canvas?.getContext('2d');

  // 1. Type / Category Heading Box
  const categoryText = (curQuiz.category || 'सामान्य विज्ञान').trim();
  const typeBaseX = 64 + offsets.typeX;
  const typeBaseY = (isReel ? 120 : isLandscape ? 40 : 55) + offsets.typeY;
  let typeW = 350;
  if (ctx) {
    ctx.save();
    ctx.font = `700 ${style.typeFontSize}px ${style.fontFamily}`;
    typeW = Math.max(120, ctx.measureText(categoryText).width);
    ctx.restore();
  }
  const typeH = style.typeFontSize * 1.4;
  const typeBox = {
    target: 'type' as DragTarget,
    left: typeBaseX - 35,
    top: typeBaseY - 25,
    right: typeBaseX + typeW + 35,
    bottom: typeBaseY + typeH + 25,
    centerX: typeBaseX + typeW / 2,
    centerY: typeBaseY + typeH / 2
  };

  // 2. Question Text Box
  const questionBaseX = W / 2 + offsets.questionX;
  const questionBaseY = (isReel ? 420 : isLandscape ? 180 : 220) + offsets.questionY;
  const questionMaxW = isLandscape ? 1600 : 920;
  let totalQuestionHeight = style.questionFontSize * 2;
  let maxLineWidth = questionMaxW;
  if (ctx) {
    ctx.save();
    ctx.font = `700 ${style.questionFontSize}px ${style.fontFamily}`;
    const qLines = wrapText(ctx, curQuiz.question || 'प्रश्न यहाँ दिखाई देगा...', questionMaxW);
    const qLineHeight = style.questionFontSize * 1.32;
    totalQuestionHeight = Math.max(qLineHeight, qLines.length * qLineHeight);
    let measuredMax = 0;
    for (const l of qLines) {
      const mw = ctx.measureText(l).width;
      if (mw > measuredMax) measuredMax = mw;
    }
    maxLineWidth = Math.min(questionMaxW, Math.max(300, measuredMax + 80));
    ctx.restore();
  }
  const questionBox = {
    target: 'question' as DragTarget,
    left: questionBaseX - (maxLineWidth / 2) - 35,
    top: questionBaseY - 30,
    right: questionBaseX + (maxLineWidth / 2) + 35,
    bottom: questionBaseY + totalQuestionHeight + 35,
    centerX: questionBaseX,
    centerY: questionBaseY + totalQuestionHeight / 2
  };

  // 3. Options Block Box (All 4 Options)
  const optW = isLandscape ? 1400 : 910;
  const optX = (W - optW) / 2 + offsets.optionsX;
  const optGap = isReel ? 28 : isLandscape ? 16 : 16;
  const optionsStartY = (isReel ? 780 : isLandscape ? 400 : 430) + offsets.optionsY;
  let totalOptionsH = (isReel ? 84 : 72) * 4 + optGap * 3;
  if (ctx) {
    ctx.save();
    ctx.font = `700 ${style.optionFontSize}px ${style.fontFamily}`;
    const shapeSize = isReel ? 68 : isLandscape ? 58 : 64;
    const maxTextAvailableWidth = optW - (14 + shapeSize + 40);
    let curY = optionsStartY;
    for (let i = 0; i < 4; i++) {
      const optText = curQuiz.options?.[i] || `Option ${['A','B','C','D'][i]}`;
      const optLines = wrapText(ctx, optText, maxTextAvailableWidth);
      const lineH = style.optionFontSize * 1.25;
      const contentH = optLines.length * lineH;
      const optH = Math.max(isReel ? 84 : 72, contentH + 24);
      curY += optH + optGap;
    }
    totalOptionsH = curY - optionsStartY;
    ctx.restore();
  }
  const optionsBox = {
    target: 'options' as DragTarget,
    left: optX - 35,
    top: optionsStartY - 30,
    right: optX + optW + 35,
    bottom: optionsStartY + totalOptionsH + 30,
    centerX: optX + optW / 2,
    centerY: optionsStartY + totalOptionsH / 2
  };



  // 5. Channel Logo Box (if active)
  let logoBox: { target: DragTarget; left: number; top: number; right: number; bottom: number; centerX: number; centerY: number } | null = null;
  if (logoConfig.enabled && logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    const maxDim = logoConfig.size || 160;
    const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
    let lW = maxDim;
    let lH = maxDim;
    if (aspect > 1) {
      lW = maxDim;
      lH = maxDim / aspect;
    } else {
      lH = maxDim;
      lW = maxDim * aspect;
    }
    const defLogoX = W - lW - 64;
    const defLogoY = isReel ? 110 : isLandscape ? 35 : 45;
    const finalLogoX = defLogoX + logoConfig.offsetX;
    const finalLogoY = defLogoY + logoConfig.offsetY;
    logoBox = {
      target: 'logo' as DragTarget,
      left: finalLogoX - 25,
      top: finalLogoY - 25,
      right: finalLogoX + lW + 25,
      bottom: finalLogoY + lH + 25,
      centerX: finalLogoX + lW / 2,
      centerY: finalLogoY + lH / 2
    };
  }

  // 6. Stopwatch Timer Box (Active when Drag Mode is ON or testing)
  let timerBox: { target: DragTarget; left: number; top: number; right: number; bottom: number; centerX: number; centerY: number } | null = null;
  if (timerConfig.enabled && (enableDrag.value || isTestingTimer.value)) {
    const timerSize = timerConfig.size || 140;
    const defTimerX = (W - timerSize) / 2;
    const defTimerY = isReel ? 630 : isLandscape ? 280 : 310;
    const finalTimerX = defTimerX + offsets.timerX;
    const finalTimerY = defTimerY + offsets.timerY;
    const totalH = timerSize * (timerConfig.showDigital !== false ? 1.25 : 1.0);

    timerBox = {
      target: 'timer' as DragTarget,
      left: finalTimerX - 20,
      top: finalTimerY - 20,
      right: finalTimerX + timerSize + 20,
      bottom: finalTimerY + totalH + 20,
      centerX: finalTimerX + timerSize / 2,
      centerY: finalTimerY + totalH / 2
    };
  }

  return { typeBox, questionBox, optionsBox, logoBox, timerBox };
}

/**
 * Automatically detects which element the user clicked or touched on the canvas.
 * Falls back to the closest element so dragging is effortless anywhere.
 */
function detectDragTarget(coords: { x: number; y: number }): DragTarget {
  const { typeBox, questionBox, optionsBox, logoBox, timerBox } = getElementBoxes(coords);

  // 1. Direct hit tests (priority: timer, type, logo, options, question, watermark)
  if (timerBox && coords.x >= timerBox.left && coords.x <= timerBox.right && coords.y >= timerBox.top && coords.y <= timerBox.bottom) {
    return 'timer';
  }
  if (coords.x >= typeBox.left && coords.x <= typeBox.right && coords.y >= typeBox.top && coords.y <= typeBox.bottom) {
    return 'type';
  }
  if (logoBox && coords.x >= logoBox.left && coords.x <= logoBox.right && coords.y >= logoBox.top && coords.y <= logoBox.bottom) {
    return 'logo';
  }
  if (coords.x >= optionsBox.left && coords.x <= optionsBox.right && coords.y >= optionsBox.top && coords.y <= optionsBox.bottom) {
    return 'options';
  }
  if (coords.x >= questionBox.left && coords.x <= questionBox.right && coords.y >= questionBox.top && coords.y <= questionBox.bottom) {
    return 'question';
  }


  // 2. Nearest element fallback
  const candidates: Array<{ target: DragTarget; left: number; top: number; right: number; bottom: number; centerX: number; centerY: number }> = [typeBox, questionBox, optionsBox];
  if (logoBox) candidates.push(logoBox);

  if (timerBox) candidates.push(timerBox);

  let closestTarget: DragTarget = 'question';
  let minDistance = Infinity;

  for (const b of candidates) {
    const clampedX = Math.max(b.left, Math.min(coords.x, b.right));
    const clampedY = Math.max(b.top, Math.min(coords.y, b.bottom));
    const dist = Math.hypot(coords.x - clampedX, coords.y - clampedY);
    if (dist < minDistance) {
      minDistance = dist;
      closestTarget = b.target;
    }
  }

  return closestTarget;
}

function startDragging(clientX: number, clientY: number) {
  if (!enableDrag.value) return;
  const coords = getCanvasCoords(clientX, clientY);
  if (!coords) return;

  // Automatically detect the clicked element! No manual pill/option selection needed!
  const target = detectDragTarget(coords);
  activeDragTarget.value = target;

  isDragging.value = true;
  dragStartX = coords.x;
  dragStartY = coords.y;

  // Lock initial coordinates of the automatically chosen target
  if (target === 'type') {
    initialTargetX = offsets.typeX;
    initialTargetY = offsets.typeY;
  } else if (target === 'question') {
    initialTargetX = offsets.questionX;
    initialTargetY = offsets.questionY;
  } else if (target === 'options') {
    initialTargetX = offsets.optionsX;
    initialTargetY = offsets.optionsY;

  } else if (target === 'logo') {
    initialTargetX = logoConfig.offsetX;
    initialTargetY = logoConfig.offsetY;
  } else if (target === 'timer') {
    initialTargetX = offsets.timerX;
    initialTargetY = offsets.timerY;
  }
}

function moveDragging(clientX: number, clientY: number) {
  if (!enableDrag.value || !isDragging.value) return;
  const coords = getCanvasCoords(clientX, clientY);
  if (!coords) return;

  const deltaX = coords.x - dragStartX;
  const deltaY = coords.y - dragStartY;

  // Move the automatically selected element smoothly in real time
  if (activeDragTarget.value === 'type') {
    offsets.typeX = initialTargetX + deltaX;
    offsets.typeY = initialTargetY + deltaY;
  } else if (activeDragTarget.value === 'question') {
    offsets.questionX = initialTargetX + deltaX;
    offsets.questionY = initialTargetY + deltaY;
  } else if (activeDragTarget.value === 'options') {
    offsets.optionsX = initialTargetX + deltaX;
    offsets.optionsY = initialTargetY + deltaY;

  } else if (activeDragTarget.value === 'logo') {
    logoConfig.offsetX = initialTargetX + deltaX;
    logoConfig.offsetY = initialTargetY + deltaY;
  } else if (activeDragTarget.value === 'timer') {
    offsets.timerX = initialTargetX + deltaX;
    offsets.timerY = initialTargetY + deltaY;
  }

  // Instant real-time redraw during dragging
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

function stopDragging() {
  isDragging.value = false;
}

// Mouse Event Handlers
function onCanvasMouseDown(e: MouseEvent) {
  startDragging(e.clientX, e.clientY);
}

function onCanvasMouseMove(e: MouseEvent) {
  if (isDragging.value) {
    moveDragging(e.clientX, e.clientY);
  }
}

function onCanvasMouseUp() {
  stopDragging();
}

function onWindowMouseMove(e: MouseEvent) {
  if (isDragging.value) {
    moveDragging(e.clientX, e.clientY);
  }
}

function onWindowMouseUp() {
  if (isDragging.value) {
    stopDragging();
  }
}

// Touch Event Handlers for Mobile Phones & Tablets
function onTouchStart(e: TouchEvent) {
  if (!enableDrag.value) return; // Allow natural smooth page scrolling when Drag Mode is OFF
  if (e.cancelable) e.preventDefault();
  if (e.touches && e.touches.length > 0) {
    const t = e.touches[0];
    startDragging(t.clientX, t.clientY);
  }
}

function onTouchMove(e: TouchEvent) {
  if (!enableDrag.value) return; // Allow natural smooth page scrolling when Drag Mode is OFF
  if (e.cancelable) e.preventDefault();
  if (e.touches && e.touches.length > 0) {
    const t = e.touches[0];
    moveDragging(t.clientX, t.clientY);
  }
}

function onTouchEnd() {
  stopDragging();
}

// ----------------- DOWNLOAD IMAGE (CRYSTAL CLEAR ULTRA-HD 4K) -----------------
async function downloadImage() {
  const baseW = currentDimensions.value.w;
  const baseH = currentDimensions.value.h;

  // 1. Ensure all custom fonts (Google Fonts) are completely loaded before render
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
  } catch (e) {
    console.warn('Font ready check warning:', e);
  }

  // 2. High-Resolution 2x Ultra-HD Offscreen Canvas (2160x2160 / 2160x3840 / 3840x2160)
  const scale = 2;
  const hdCanvas = document.createElement('canvas');
  hdCanvas.width = baseW * scale;
  hdCanvas.height = baseH * scale;

  const hdCtx = hdCanvas.getContext('2d', { alpha: false });
  if (!hdCtx) return;

  // High quality smoothing for logos & silhouettes
  hdCtx.imageSmoothingEnabled = true;
  hdCtx.imageSmoothingQuality = 'high';

  // Apply 2x scale: all drawing commands render with 2x subpixel rasterization & zero blur
  hdCtx.save();
  hdCtx.scale(scale, scale);

  renderCanvasToCtx(
    hdCtx,
    { width: baseW, height: baseH } as HTMLCanvasElement,
    1.0,
    [1.0, 1.0, 1.0, 1.0],
    0.0,
    false,
    false,
    1.0,
    undefined,
    true
  );
  hdCtx.restore();

  // 3. Export as pristine lossless PNG blob (avoids dataURL truncation and blur)
  hdCanvas.toBlob((blob) => {
    if (!blob) {
      const fallbackUrl = hdCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `hindi-quiz-hd-${selectedRatio.value}-${Date.now()}.png`;
      link.href = fallbackUrl;
      link.click();
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `hindi-quiz-hd-${selectedRatio.value}-${Date.now()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);
  }, 'image/png');
}

// Helper: Convert AudioBuffer to WAV Blob
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const len = buffer.length;
  const dataSize = len * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < len; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = buffer.getChannelData(channel)[i];
      // Smooth soft-knee saturation curve to completely eliminate harsh digital square-wave clipping
      if (sample > 0.98) {
        sample = 0.98 + (sample - 0.98) / (1 + (sample - 0.98));
      } else if (sample < -0.98) {
        sample = -0.98 + (sample + 0.98) / (1 + Math.abs(sample + 0.98));
      }
      sample = Math.max(-1.0, Math.min(1.0, sample));
      const intSample = Math.round(sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
      view.setInt16(offset, Math.max(-32768, Math.min(32767, intSample)), true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// ----------------- NON-THROTTLED EVENT LOOP YIELD (BACKGROUND TAB IMMUNE) -----------------
/**
 * Yields execution to the browser event loop WITHOUT background tab timer throttling.
 * Browsers throttle setTimeout/setInterval to 1000ms in background tabs, but MessageChannel
 * port tasks run immediately (<0.1ms) even when tab is hidden, minimized, or inactive!
 */
function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      channel.port2.close();
      resolve();
    };
    channel.port2.postMessage(null);
  });
}

// ----------------- TOP-CLASS MULTI-QUESTION VIDEO COMPILATION GENERATOR -----------------
async function startBulletproofVideoGeneration() {
  if (isGeneratingVideo.value) return;
  // Automatically turn off drag mode so canvas outlines/indicators do not show
  if (enableDrag.value) {
    enableDrag.value = false;
  }
  isGeneratingVideo.value = true;
  videoProgress.value = 5;
  currentVideoStatus.value = `Step 1/3: Preparing Audio for ${quizList.length} Question(s)...`;

  const canvas = previewCanvas.value;
  if (!canvas) {
    isGeneratingVideo.value = false;
    return;
  }

  // 1. Keep Screen Awake & Prevent OS Sleep during video generation
  let wakeLock: any = null;
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await (navigator as any).wakeLock.request('screen');
    } catch (_) {}
  }

  // 2. Setup AudioContext with Active Keep-Alive Node (prevents Chrome background tab freezing)
  let silentOsc: OscillatorNode | null = null;
  let silentGain: GainNode | null = null;

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // Keep AudioContext active so browser classifies this tab as active media processing (no CPU throttle)
    try {
      silentOsc = audioCtx.createOscillator();
      silentGain = audioCtx.createGain();
      silentGain.gain.value = 0.00001; // Inaudible keep-alive signal
      silentOsc.connect(silentGain);
      silentGain.connect(audioCtx.destination);
      silentOsc.start();
    } catch (_) {}
    
    const letters = ['A', 'B', 'C', 'D'];
    const letterNamesHindi = ['ए', 'बी', 'सी', 'डी'];

    // Preload sound effects once
    const [timerSoundBuf, correctSoundBuf] = await Promise.all([
      fetchAudioFileBuffer('/timer-sound.wav', audioCtx),
      fetchAudioFileBuffer('/correct-answer-sound.wav', audioCtx)
    ]);

    interface QuestionSegment {
      index: number;
      quizItem: QuizQuestion;
      startTime: number;
      duration: number;
      contentDuration: number;
      pauseAfter: number;
      opt0Start: number;
      opt1Start: number;
      opt2Start: number;
      opt3Start: number;
      timerStart: number;
      timerCountdown: number;
      timerEnd: number;
      revealStart: number;
    }

    const segments: QuestionSegment[] = [];
    let currentTimeline = 0;

    const audioPlacementList: Array<{
      buffer: AudioBuffer | null;
      startSec: number;
      maxDurationSec?: number;
      volume?: number;
      fadeOutSec?: number;
    }> = [];

    // 1. Generate Voice and build segments for all questions sequentially
    for (let qIdx = 0; qIdx < quizList.length; qIdx++) {
      const qItem = quizList[qIdx];
      const qNum = qIdx + 1;
      currentVideoStatus.value = `Step 1/3: Generating Audio for Question ${qNum}/${quizList.length}...`;
      videoProgress.value = Math.round(5 + (qIdx / quizList.length) * 15);

      const correctLetterHindi = letterNamesHindi[qItem.correctOption - 1] || 'ए';
      const correctOptionText = qItem.options[qItem.correctOption - 1] || '';

      const questionSpeechText = `${qItem.question || 'प्रश्न ' + qNum}`;
      const optTexts = [
        `ऑप्शन ए, ${qItem.options[0] || 'ऑप्शन ए'}`,
        `ऑप्शन बी, ${qItem.options[1] || 'ऑप्शन बी'}`,
        `ऑप्शन सी, ${qItem.options[2] || 'ऑप्शन सी'}`,
        `ऑप्शन डी, ${qItem.options[3] || 'ऑप्शन डी'}`
      ];
      const correctSpeechText = `सही उत्तर है, ऑप्शन ${correctLetterHindi}, ${correctOptionText}`;

      // Stable sequential TTS generation with micro-pauses (prevents API rate-limits & voice collisions)
      const qAudio = await fetchTtsAudioBuffer(questionSpeechText, audioCtx);
      const opt0Audio = await fetchTtsAudioBuffer(optTexts[0], audioCtx);
      const opt1Audio = await fetchTtsAudioBuffer(optTexts[1], audioCtx);
      const opt2Audio = await fetchTtsAudioBuffer(optTexts[2], audioCtx);
      const opt3Audio = await fetchTtsAudioBuffer(optTexts[3], audioCtx);
      const corrAudio = await fetchTtsAudioBuffer(correctSpeechText, audioCtx);

      const qDuration = Math.max(3.0, qAudio.duration + 0.3);
      const opt0Dur = opt0Audio.duration + 0.25;
      const opt1Dur = opt1Audio.duration + 0.25;
      const opt2Dur = opt2Audio.duration + 0.25;
      const opt3Dur = opt3Audio.duration + 0.35;

      const opt0Start = qDuration;
      const opt1Start = opt0Start + opt0Dur;
      const opt2Start = opt1Start + opt1Dur;
      const opt3Start = opt2Start + opt2Dur;
      const optionsEnd = opt3Start + opt3Dur;

      const timerCountdown = timerConfig.enabled ? Math.max(1, timerConfig.duration || 5) : 0.0;
      const timerStart = optionsEnd;
      const timerEnd = timerStart + timerCountdown;

      const revealStart = timerEnd;
      const corrSoundLead = 0.35; // Chime rings and voice starts right away
      const corrSpeechStart = revealStart + corrSoundLead;
      const revealDuration = corrSoundLead + corrAudio.duration + 0.25; // Clean 0.25s buffer after speech finishes
      const contentDuration = revealStart + revealDuration;

      // 2nd question turant aaye just after option sahi batane ke
      const isLastQuestion = (qIdx === quizList.length - 1);
      const pauseAfter = isLastQuestion ? 0.35 : 0.0;
      const segmentDuration = contentDuration + pauseAfter;

      const segStartTime = currentTimeline;

      segments.push({
        index: qIdx,
        quizItem: qItem,
        startTime: segStartTime,
        duration: segmentDuration,
        contentDuration,
        pauseAfter,
        opt0Start,
        opt1Start,
        opt2Start,
        opt3Start,
        timerStart,
        timerCountdown,
        timerEnd,
        revealStart
      });

      // Schedule Audio Clips for this question segment (clean balanced volume mix)
      const segmentClips: any[] = [
        { buffer: qAudio.buffer, startSec: segStartTime + 0.2, volume: 0.95 },
        { buffer: opt0Audio.buffer, startSec: segStartTime + opt0Start, volume: 0.95 },
        { buffer: opt1Audio.buffer, startSec: segStartTime + opt1Start, volume: 0.95 },
        { buffer: opt2Audio.buffer, startSec: segStartTime + opt2Start, volume: 0.95 },
        { buffer: opt3Audio.buffer, startSec: segStartTime + opt3Start, volume: 0.95 }
      ];

      if (timerCountdown > 0) {
        segmentClips.push({
          buffer: timerSoundBuf,
          startSec: segStartTime + timerStart,
          maxDurationSec: timerCountdown,
          volume: 0.50, // Balanced tick volume, no voice clash
          fadeOutSec: 0.15
        });
      }

      segmentClips.push(
        { buffer: correctSoundBuf, startSec: segStartTime + revealStart, maxDurationSec: revealDuration, volume: 0.65, fadeOutSec: 0.1 },
        { buffer: corrAudio.buffer, startSec: segStartTime + corrSpeechStart, volume: 0.95 }
      );

      audioPlacementList.push(...segmentClips);

      currentTimeline += segmentDuration;
    }

    const totalDuration = currentTimeline;

    // Master Audio Buffer for entire compilation video
    const masterAudioBuffer = audioCtx.createBuffer(
      2,
      Math.ceil(totalDuration * audioCtx.sampleRate),
      audioCtx.sampleRate
    );

    function copyAudioToMaster(
      sourceBuf: AudioBuffer | null, 
      startSec: number, 
      maxDurationSec?: number, 
      volume: number = 1.0, 
      fadeOutSec: number = 0
    ) {
      if (!sourceBuf) return;
      const startSample = Math.round(startSec * audioCtx.sampleRate);
      const maxSamples = maxDurationSec ? Math.round(maxDurationSec * audioCtx.sampleRate) : sourceBuf.length;
      const numSamples = Math.min(sourceBuf.length, maxSamples);
      const fadeOutSamples = fadeOutSec > 0 ? Math.round(fadeOutSec * audioCtx.sampleRate) : 0;

      for (let channel = 0; channel < 2; channel++) {
        const sourceData = sourceBuf.getChannelData(Math.min(channel, sourceBuf.numberOfChannels - 1));
        const masterData = masterAudioBuffer.getChannelData(channel);
        for (let i = 0; i < numSamples; i++) {
          if (startSample + i < masterData.length) {
            let gain = volume;
            if (fadeOutSamples > 0 && i >= numSamples - fadeOutSamples) {
              const remaining = numSamples - i;
              gain = volume * (remaining / fadeOutSamples);
            }
            masterData[startSample + i] += sourceData[i] * gain;
          }
        }
      }
    }

    for (const item of audioPlacementList) {
      copyAudioToMaster(item.buffer, item.startSec, item.maxDurationSec, item.volume, item.fadeOutSec);
    }

    // Professional Master Limiter & Peak Normalization (Eliminates all digital clipping & "khar khach")
    let maxPeak = 0;
    for (let c = 0; c < 2; c++) {
      const data = masterAudioBuffer.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        const abs = Math.abs(data[i]);
        if (abs > maxPeak) maxPeak = abs;
      }
    }

    if (maxPeak > 0.95) {
      const reduction = 0.95 / maxPeak;
      for (let c = 0; c < 2; c++) {
        const data = masterAudioBuffer.getChannelData(c);
        for (let i = 0; i < data.length; i++) {
          data[i] = data[i] * reduction;
        }
      }
    }

    const wavBlob = audioBufferToWavBlob(masterAudioBuffer);

    // Multi-Resolution WebCodecs Encoding
    const fps = 30;
    const frameDurationMicros = Math.round(1_000_000 / fps);
    const totalFrames = Math.round(totalDuration * fps);
    const videoW = currentDimensions.value.w;
    const videoH = currentDimensions.value.h;

    videoProgress.value = 22;
    currentVideoStatus.value = `Step 2/3: Encoding ${quizList.length} Questions (${Math.round(totalDuration)}s)...`;

    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width: videoW,
        height: videoH
      },
      fastStart: 'in-memory',
      firstTimestampBehavior: 'offset'
    });

    let encoderError: any = null;
    const videoEncoder = new (window as any).VideoEncoder({
      output: (chunk: any, meta: any) => {
        try {
          // WebCodecs chunk.duration is often null or undefined.
          // mp4-muxer requires duration to be a non-negative finite number.
          const duration = (typeof chunk.duration === 'number' && Number.isFinite(chunk.duration) && chunk.duration >= 0)
            ? chunk.duration
            : frameDurationMicros;

          const data = new Uint8Array(chunk.byteLength);
          chunk.copyTo(data);

          muxer.addVideoChunkRaw(
            data,
            chunk.type,
            chunk.timestamp,
            duration,
            meta
          );
        } catch (err) {
          console.error('Error adding video chunk to muxer:', err);
          encoderError = err;
        }
      },
      error: (e: any) => {
        console.error('VideoEncoder error:', e);
        encoderError = e;
      }
    });

    await videoEncoder.configure({
      codec: 'avc1.420028',
      width: videoW,
      height: videoH,
      bitrate: videoW > 1080 || videoH > 1080 ? 6_000_000 : 4_000_000,
      framerate: fps
    });

    // Offscreen render canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = videoW;
    offCanvas.height = videoH;
    const offCtx = offCanvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!offCtx) throw new Error('Offscreen canvas context failed');

    for (let f = 0; f < totalFrames; f++) {
      if (encoderError) throw encoderError;

      // Drain encoder queue using non-throttled MessageChannel microtask
      while (videoEncoder.encodeQueueSize > 6) {
        await yieldToEventLoop();
      }

      const elapsed = f / fps;

      // Find current active segment for this timestamp
      let activeSeg = segments[segments.length - 1];
      for (let s = 0; s < segments.length; s++) {
        if (elapsed >= segments[s].startTime && elapsed < segments[s].startTime + segments[s].duration) {
          activeSeg = segments[s];
          break;
        }
      }

      const localElapsed = Math.max(0, elapsed - activeSeg.startTime);

      // 1. Question Animation Progress
      let qAnimProgress = 1.0;
      if (style.questionAnimation !== 'none') {
        const qDur = Math.max(0.8, Math.min(2.0, activeSeg.opt0Start - 0.2));
        qAnimProgress = Math.min(1.0, Math.max(0.0, (localElapsed - 0.2) / qDur));
      }

      // 2. Options Animation Progress
      let optsPanProgress = [1.0, 1.0, 1.0, 1.0];
      if (style.optionsAnimation !== 'none') {
        const optStarts = [activeSeg.opt0Start, activeSeg.opt1Start, activeSeg.opt2Start, activeSeg.opt3Start];
        optsPanProgress = optStarts.map((start, idx) => {
          const nextStart = idx < 3 ? optStarts[idx + 1] : activeSeg.timerStart;
          const dur = Math.max(0.4, Math.min(1.0, nextStart - start));
          return Math.min(1.0, Math.max(0.0, (localElapsed - start) / dur));
        });
      }

      // 3. Stopwatch countdown timer
      let timerProgress = 0;
      let isTimerActive = false;
      if (timerConfig.enabled && activeSeg.timerCountdown > 0) {
        if (localElapsed >= activeSeg.timerStart && localElapsed < activeSeg.timerEnd) {
          isTimerActive = true;
          timerProgress = Math.min(1.0, (localElapsed - activeSeg.timerStart) / activeSeg.timerCountdown);
        }
      }

      // 4. Correct Answer Reveal & Pulse
      let isRevealed = false;
      let pulseScale = 1.0;
      if (localElapsed >= activeSeg.revealStart) {
        isRevealed = true;
        const revElapsed = localElapsed - activeSeg.revealStart;
        if (revElapsed < 1.2) {
          pulseScale = 1.0 + 0.04 * Math.sin(revElapsed * Math.PI * 3);
        }
      }

      // Render exclusively to background offCanvas with current active question!
      renderCanvasToCtx(
        offCtx,
        offCanvas,
        qAnimProgress,
        optsPanProgress,
        timerProgress,
        isRevealed,
        isTimerActive,
        pulseScale,
        activeSeg.quizItem,
        true // isExport = true (Strict: timer ONLY appears when isTimerActive is true!)
      );

      const timestampMicroseconds = Math.round((f * 1_000_000) / fps);
      const videoFrame = new (window as any).VideoFrame(offCanvas, {
        timestamp: timestampMicroseconds,
        duration: frameDurationMicros
      });
      const isKeyFrame = f % 30 === 0;
      videoEncoder.encode(videoFrame, { keyFrame: isKeyFrame });
      videoFrame.close();

      videoProgress.value = Math.min(85, Math.round(22 + (f / totalFrames) * 63));
      // Non-throttled event loop yield every 5 frames so background tabs / minimized windows never pause
      if (f % 5 === 0) {
        await yieldToEventLoop();
      }
    }

    await videoEncoder.flush();
    if (encoderError) throw encoderError;
    muxer.finalize();

    const videoArrayBuffer = muxer.target.buffer;

    videoProgress.value = 88;
    currentVideoStatus.value = 'Step 3/3: Merging HD Video & Audio Stream...';

    // Send as standard multipart FormData (100% reliable across all browsers & cloud servers)
    const formData = new FormData();
    formData.append('video', new Blob([videoArrayBuffer], { type: 'video/mp4' }), 'video.mp4');
    formData.append('audio', wavBlob, 'audio.wav');

    const mergeRes = await fetch('/api/merge-video-audio', {
      method: 'POST',
      body: formData
    });

    if (!mergeRes.ok) {
      throw new Error('Merge service failed');
    }

    const finalMp4Blob = await mergeRes.blob();
    generatedVideoUrl.value = URL.createObjectURL(finalMp4Blob);

    videoProgress.value = 100;
    currentVideoStatus.value = `${selectedRatio.value} Multi-Video Ready (${quizList.length} Qs)!`;
    playVideoModal.value = true;

    // Notify user in title and play pleasant completion chime
    document.title = '✅ Video Ready! - Hindi Quiz Studio';
    try {
      const chimeOsc = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      chimeOsc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      chimeGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(audioCtx.destination);
      chimeOsc.start();
      chimeOsc.stop(audioCtx.currentTime + 0.5);
    } catch (_) {}
    setTimeout(() => {
      document.title = 'Hindi Quiz Studio - Multi-Format Video Generator';
    }, 10000);
  } catch (err: any) {
    console.error('Video error:', err);
    alert('Error generating video: ' + err.message);
  } finally {
    isGeneratingVideo.value = false;
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
    if (silentOsc) {
      try { silentOsc.stop(); silentOsc.disconnect(); } catch (_) {}
    }
    if (silentGain) {
      try { silentGain.disconnect(); } catch (_) {}
    }
    if (wakeLock) {
      try { await wakeLock.release(); } catch (_) {}
    }
  }
}

// Global alias so @click="generateVideo" works seamlessly everywhere
const generateVideo = startBulletproofVideoGeneration;

function downloadVideo() {
  if (!generatedVideoUrl.value) return;
  const a = document.createElement('a');
  a.href = generatedVideoUrl.value;
  a.download = `hindi-quiz-${selectedRatio.value}-${Date.now()}.mp4`;
  a.click();
}
</script>
